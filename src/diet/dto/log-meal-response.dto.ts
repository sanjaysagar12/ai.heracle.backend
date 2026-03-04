import { ApiProperty } from '@nestjs/swagger';

export class FoodItemDto {
    @ApiProperty({ example: 'Grilled Chicken', description: 'Name of the food item' })
    name: string;

    @ApiProperty({ example: 280, description: 'Calories (kcal)' })
    calories: number;

    @ApiProperty({ example: 0, description: 'Carbohydrates (g)' })
    carbs: number;

    @ApiProperty({ example: 53, description: 'Protein (g)' })
    protein: number;

    @ApiProperty({ example: 6, description: 'Fat (g)' })
    fat: number;

    @ApiProperty({ example: 0, description: 'Dietary fiber (g)' })
    fiber: number;
}

export class LogMealResponseDto {
    @ApiProperty({ example: 'uuid-...' })
    id: string;

    @ApiProperty({ example: 'uuid-...' })
    userId: string;

    @ApiProperty({ example: 'lunch', enum: ['breakfast', 'lunch', 'dinner', 'snack'] })
    mealType: string;

    @ApiProperty({ example: '2026-03-04' })
    date: string;

    @ApiProperty({ example: '13:30' })
    time: string;

    @ApiProperty({ type: [FoodItemDto], description: 'Array of food items with nutritional info' })
    data: FoodItemDto[];

    @ApiProperty({ example: '2026-03-04T08:05:00.000Z' })
    createdAt: Date;
}
