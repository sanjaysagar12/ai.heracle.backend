import { ApiProperty } from '@nestjs/swagger';

export class FoodItemInputDto {
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

export class LogMealRequestDto {
    @ApiProperty({
        example: 'breakfast',
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        description: 'Type of meal',
    })
    mealType: string;

    @ApiProperty({ example: '2026-03-04', description: 'Date of the meal (YYYY-MM-DD)' })
    date: string;

    @ApiProperty({ example: '08:30', description: 'Time of the meal (HH:MM)' })
    time: string;

    @ApiProperty({
        type: [FoodItemInputDto],
        description: 'Array of food items with their nutritional info',
    })
    data: FoodItemInputDto[];
}
