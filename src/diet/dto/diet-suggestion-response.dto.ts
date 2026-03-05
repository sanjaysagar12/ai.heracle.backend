import { ApiProperty } from '@nestjs/swagger';

class FoodItemDto {
    @ApiProperty({ example: 'Grilled Chicken' })
    name: string;

    @ApiProperty({ example: 'Protein' })
    purpose: string;

    @ApiProperty({ example: 300 })
    calories: number;

    @ApiProperty({ example: 40 })
    protein: number;

    @ApiProperty({ example: 0 })
    carbs: number;

    @ApiProperty({ example: 10 })
    fat: number;

    @ApiProperty({ example: 0 })
    fiber: number;
}

export class DietSuggestionResponseDto {
    @ApiProperty({ example: 'a1b2c3d4...' })
    id: string;

    @ApiProperty({ example: 'A balanced meal with {30g protein}...' })
    suggestion: string;

    @ApiProperty({ type: [FoodItemDto], nullable: true })
    suggestedMeal: FoodItemDto[] | null;

    @ApiProperty({ example: '2026-03-05' })
    date: string;

    @ApiProperty()
    createdAt: Date;
}
