import { ApiPropertyOptional } from '@nestjs/swagger';

export class SaveBodyMetricsDto {
    @ApiPropertyOptional({ example: 25 })
    age?: number;

    @ApiPropertyOptional({ example: 'male', enum: ['male', 'female', 'other', 'prefer_not_to_say'] })
    gender?: string;

    @ApiPropertyOptional({ example: 175.5, description: 'Height in centimetres' })
    heightCm?: number;

    @ApiPropertyOptional({ example: 5.9, description: 'Height in feet (display value)' })
    heightFt?: number;

    @ApiPropertyOptional({ example: 75.0, description: 'Weight in kilograms' })
    weightKg?: number;

    @ApiPropertyOptional({ example: 165.3, description: 'Weight in pounds (display value)' })
    weightLbs?: number;

    @ApiPropertyOptional({ example: 'mesomorph', enum: ['ectomorph', 'mesomorph', 'endomorph'] })
    bodyType?: string;

    @ApiPropertyOptional({
        example: 'muscle_gain',
        enum: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness'],
    })
    goal?: string;

    @ApiPropertyOptional({ example: 70.0, description: 'Goal weight in kilograms' })
    goalWeightKg?: number;

    @ApiPropertyOptional({ example: 154.3, description: 'Goal weight in pounds' })
    goalWeightLbs?: number;
}

export class BodyMetricsResponseDto {
    @ApiPropertyOptional({ example: 25 })
    age: number | null;

    @ApiPropertyOptional({ example: 'male' })
    gender: string | null;

    @ApiPropertyOptional({ example: 175.5 })
    heightCm: number | null;

    @ApiPropertyOptional({ example: 5.9 })
    heightFt: number | null;

    @ApiPropertyOptional({ example: 75.0 })
    weightKg: number | null;

    @ApiPropertyOptional({ example: 165.3 })
    weightLbs: number | null;

    @ApiPropertyOptional({ example: 'mesomorph' })
    bodyType: string | null;

    @ApiPropertyOptional({ example: 'muscle_gain' })
    goal: string | null;

    @ApiPropertyOptional({ example: 22.5, description: 'Body Mass Index' })
    bmi: number | null;

    @ApiPropertyOptional({ example: 2500, description: 'Daily maintenance calories (TDEE)' })
    maintenanceCalories: number | null;

    @ApiPropertyOptional({ example: 70.0 })
    goalWeightKg: number | null;

    @ApiPropertyOptional({ example: 154.3 })
    goalWeightLbs: number | null;

    @ApiPropertyOptional({ example: 2200 })
    targetCalories: number | null;

    @ApiPropertyOptional({ example: 150.5 })
    targetProtein: number | null;

    @ApiPropertyOptional({ example: 250.0 })
    targetCarbs: number | null;

    @ApiPropertyOptional({ example: 65.0 })
    targetFat: number | null;

    @ApiPropertyOptional({ example: 30.0 })
    targetFiber: number | null;

    @ApiPropertyOptional({ example: '2026-02-25T11:30:00.000Z' })
    updatedAt: Date | null;
}
