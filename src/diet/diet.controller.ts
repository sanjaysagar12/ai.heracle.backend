import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    Query,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiBody,
    ApiConsumes,
    ApiOkResponse,
    ApiOperation,
    ApiTags,
    ApiBadRequestResponse,
    ApiQuery,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { DietService } from './diet.service';
import { DietPreferencesResponseDto, SaveDietPreferencesDto } from './dto/diet-preferences.dto';
import { LogMealRequestDto } from './dto/log-meal-request.dto';
import { LogMealResponseDto } from './dto/log-meal-response.dto';
import { AnalyseFoodRequestDto } from './dto/analyse-food-request.dto';
import { AnalyseFoodResponseDto } from './dto/analyse-food-response.dto';

@ApiTags('Diet')
@ApiBearerAuth('JWT')
@Controller('diet')
export class DietController {
    constructor(private readonly dietService: DietService) { }

    @Get('today')
    @ApiOperation({
        summary: "Get today's diet plan",
        description: 'Returns the diet plan for today. Returns null if not yet available.',
    })
    @ApiOkResponse({ description: 'Latest diet suggestion' })
    async getTodayDiet(@Req() req: any) {
        return this.dietService.getTodayDiet(req.user.id);
    }

    @Get('meals')
    @ApiOperation({ summary: 'Get meals for a specific date' })
    @ApiQuery({ name: 'date', required: false, description: 'Date in YYYY-MM-DD format. Defaults to today.' })
    @ApiOkResponse({ type: [LogMealResponseDto] })
    async getMealsByDate(@Req() req: any, @Query('date') date?: string) {
        const targetDate = date ?? new Date().toISOString().split('T')[0];
        return this.dietService.getMealsByDate(req.user.id, targetDate);
    }

    @Get('preferences')
    @ApiOperation({ summary: 'Get dietary preferences' })
    @ApiOkResponse({ type: DietPreferencesResponseDto })
    async getDietPreferences(@Req() req: any) {
        return this.dietService.getDietPreferences(req.user.id);
    }

    @Post('preferences')
    @ApiOperation({
        summary: 'Save dietary preferences',
        description: 'Creates or updates dietary preference, daily water intake, and meals per day. All fields optional.',
    })
    @ApiBody({ type: SaveDietPreferencesDto })
    @ApiOkResponse({ type: DietPreferencesResponseDto })
    async saveDietPreferences(@Req() req: any, @Body() body: SaveDietPreferencesDto) {
        return this.dietService.saveDietPreferences(req.user.id, body);
    }

    @Post('meal')
    @ApiOperation({
        summary: 'Log a meal',
        description:
            'Save a meal to the database. ' +
            'The caller provides the food items with their nutritional info directly (no AI involved). ' +
            'Use POST /diet/ai/food first to get the nutritional breakdown from AI, then call this endpoint to save.',
    })
    @ApiBody({ type: LogMealRequestDto })
    @ApiOkResponse({ type: LogMealResponseDto })
    async logMeal(@Req() req: any, @Body() body: LogMealRequestDto): Promise<LogMealResponseDto> {
        return this.dietService.logMeal(req.user.id, body);
    }

    @Post('ai/food')
    @UseInterceptors(FileInterceptor('image'))
    @ApiConsumes('multipart/form-data')
    @ApiOperation({
        summary: 'Analyse food with AI',
        description:
            'Upload a food image and/or provide a text description. ' +
            'The AI (OpenAI or Gemini, controlled by AI_PROVIDER env) identifies each food item and returns ' +
            'calories, carbs, protein, fat, and fiber. Nothing is saved to the database.',
    })
    @ApiBody({ type: AnalyseFoodRequestDto })
    @ApiOkResponse({ type: AnalyseFoodResponseDto })
    @ApiBadRequestResponse({ description: 'Neither image nor description was provided.' })
    async analyseFood(
        @UploadedFile() image: Express.Multer.File | undefined,
        @Body() body: AnalyseFoodRequestDto,
    ): Promise<AnalyseFoodResponseDto> {
        return this.dietService.analyseFood(body.description, image);
    }
}
