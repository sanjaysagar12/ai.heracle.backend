import { BadRequestException, Injectable, InternalServerErrorException, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SaveDietPreferencesDto } from './dto/diet-preferences.dto';
import { LogMealRequestDto } from './dto/log-meal-request.dto';
import { LogMealResponseDto } from './dto/log-meal-response.dto';
import { AnalyseFoodResponseDto } from './dto/analyse-food-response.dto';
import OpenAI from 'openai';
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from '@google/generative-ai';

type FoodItem = {
    name: string;
    calories: number;
    carbs: number;
    protein: number;
    fat: number;
    fiber: number;
};

const SYSTEM_PROMPT = `You are a professional nutritionist AI.
Analyse the provided food (image and/or description).
Provide a concise name and description for the entire meal. The 'name' field should explicitly mention the main food items identified (e.g., "Grilled Chicken, Rice, and Broccoli").
Calculate the TOTAL nutritional values summed across all food items identified.
Respond with ONLY a valid JSON object.
CRITICAL: DO NOT use markdown formatting, DO NOT wrap the response in \`\`\`json code blocks. Just return the raw JSON braces.
The object must follow this exact shape:
{ "name": string, "description": string, "calories": number, "carbs": number, "protein": number, "fat": number, "fiber": number }
All numeric values (carbs, protein, fat, fiber) must be total grams (g) for the entire meal.
Calories must be the total kcal for the entire meal.
If you cannot determine a value, use 0.`;

@Injectable()
export class DietService {
    private readonly openai: OpenAI;
    private readonly gemini: GoogleGenerativeAI;

    constructor(private readonly prisma: PrismaService) {
        this.openai = new OpenAI({ apiKey: process.env.OPENAI_API });
        this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API ?? '');

        const provider = (process.env.AI_PROVIDER ?? 'openai').toLowerCase();
        if (provider === 'gemini') {
            const key = process.env.GEMINI_API ?? '';
        }
    }

    getTodayDiet() {
        return null;
    }

    // ── Diet Preferences ───────────────────────────────────────────────────────

    async getDietPreferences(userId: string) {
        return this.prisma.userProfile.findUnique({
            where: { userId },
            select: {
                dietaryPreference: true,
                dailyWaterLitres: true,
                mealsPerDay: true,
                updatedAt: true,
            },
        });
    }

    async saveDietPreferences(userId: string, dto: SaveDietPreferencesDto) {
        return this.prisma.userProfile.upsert({
            where: { userId },
            create: {
                userId,
                dietaryPreference: dto.dietaryPreference,
                dailyWaterLitres: dto.dailyWaterLitres,
                mealsPerDay: dto.mealsPerDay,
            },
            update: {
                ...(dto.dietaryPreference !== undefined && { dietaryPreference: dto.dietaryPreference }),
                ...(dto.dailyWaterLitres !== undefined && { dailyWaterLitres: dto.dailyWaterLitres }),
                ...(dto.mealsPerDay !== undefined && { mealsPerDay: dto.mealsPerDay }),
                updatedAt: new Date(),
            },
            select: {
                dietaryPreference: true,
                dailyWaterLitres: true,
                mealsPerDay: true,
                updatedAt: true,
            },
        });
    }

    // ── Meal Log (no AI — user provides nutrition data) ────────────────────────

    async logMeal(userId: string, dto: LogMealRequestDto): Promise<LogMealResponseDto> {
        const meal = await this.prisma.meal.create({
            data: {
                userId,
                mealType: dto.mealType,
                date: dto.date,
                time: dto.time,
                data: dto.data as unknown as object[],
            },
            select: {
                id: true,
                userId: true,
                mealType: true,
                date: true,
                time: true,
                data: true,
                createdAt: true,
            },
        });

        return {
            id: meal.id,
            userId: meal.userId,
            mealType: meal.mealType,
            date: meal.date,
            time: meal.time,
            data: meal.data as unknown as LogMealResponseDto['data'],
            createdAt: meal.createdAt,
        };
    }

    // ── AI Food Analysis (no DB save — returns nutrition only) ─────────────────

    async analyseFood(
        description?: string,
        imageFile?: Express.Multer.File,
    ): Promise<AnalyseFoodResponseDto> {
        if (!imageFile && !description) {
            throw new BadRequestException(
                'At least one of image (file upload) or description must be provided.',
            );
        }

        const provider = (process.env.AI_PROVIDER ?? 'openai').toLowerCase();

        const raw =
            provider === 'gemini'
                ? await this.analyseWithGemini(description, imageFile)
                : await this.analyseWithOpenAI(description, imageFile);

        const cleanedRaw = raw.replace(/```json/gi, '').replace(/```/g, '').trim();

        let result: AnalyseFoodResponseDto;
        try {
            result = JSON.parse(cleanedRaw);
            if (typeof result !== 'object' || Array.isArray(result)) throw new Error('Not an object');
        } catch {
            throw new BadRequestException(
                `${provider === 'gemini' ? 'Gemini' : 'OpenAI'} returned an unexpected format. Please try again or provide a clearer image/description.`,
            );
        }

        return result;
    }

    // ── Private AI helpers ─────────────────────────────────────────────────────

    private async analyseWithOpenAI(
        description?: string,
        imageFile?: Express.Multer.File,
    ): Promise<string> {
        const model = process.env.OPENAI_MODEL ?? 'gpt-4o';

        type ContentPart =
            | { type: 'text'; text: string }
            | { type: 'image_url'; image_url: { url: string; detail: 'auto' } };

        const userContent: ContentPart[] = [];

        if (imageFile) {
            const mimeType = imageFile.mimetype || 'image/jpeg';
            const b64 = imageFile.buffer.toString('base64');
            userContent.push({
                type: 'image_url',
                image_url: { url: `data:${mimeType};base64,${b64}`, detail: 'auto' },
            });
        }
        if (description) {
            userContent.push({ type: 'text', text: description });
        }

        try {
            const completion = await this.openai.chat.completions.create({
                model,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: userContent },
                ],
                max_tokens: 1024,
            });
            return completion.choices[0]?.message?.content ?? '[]';
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            if (/503|Service Unavailable|overload|high demand/i.test(msg) ||
                /429|Too Many Requests|rate limit/i.test(msg)) {
                throw new ServiceUnavailableException(
                    `The AI model (${model}) is temporarily unavailable or rate-limited. Please try again in a moment.`,
                );
            }
            throw new InternalServerErrorException(
                `OpenAI request failed (model: ${model}): ${msg}`,
            );
        }
    }

    private async analyseWithGemini(
        description?: string,
        imageFile?: Express.Multer.File,
    ): Promise<string> {
        const modelName = process.env.GEMINI_MODEL ?? 'gemini-1.5-flash';

        const geminiKey = process.env.GEMINI_API ?? '';
        if (!geminiKey || geminiKey === 'your-gemini-api-key-here') {
            throw new InternalServerErrorException(
                'GEMINI_API key is not configured. Add your key to .env and restart the server.',
            );
        }

        const model = this.gemini.getGenerativeModel({
            model: modelName,
            safetySettings: [
                { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
            ],
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const parts: any[] = [{ text: SYSTEM_PROMPT }];

        if (imageFile) {
            parts.push({
                inlineData: {
                    mimeType: imageFile.mimetype || 'image/jpeg',
                    data: imageFile.buffer.toString('base64'),
                },
            });
        }
        if (description) {
            parts.push({ text: description });
        }

        try {
            const result = await model.generateContent(parts);
            return result.response.text() ?? '[]';
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            if (/503|Service Unavailable|overload|high demand/i.test(msg) ||
                /429|Too Many Requests|rate limit/i.test(msg)) {
                throw new ServiceUnavailableException(
                    `The AI model (${modelName}) is temporarily unavailable or rate-limited. Please try again in a moment.`,
                );
            }
            throw new InternalServerErrorException(
                `Gemini request failed (model: ${modelName}): ${msg}. ` +
                'Check your GEMINI_API key and network connectivity.',
            );
        }
    }
}
