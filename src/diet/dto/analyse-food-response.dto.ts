import { ApiProperty } from '@nestjs/swagger';

export class AnalyseFoodResponseDto {
    @ApiProperty({ example: 'Grilled Chicken Salad', description: 'A short, descriptive name for the meal' })
    name: string;

    @ApiProperty({ example: 'A healthy mix of grilled chicken breast and fresh leafy greens.', description: 'A brief description of the meal' })
    description: string;

    @ApiProperty({ example: 450, description: 'Total calories (kcal)' })
    calories: number;

    @ApiProperty({ example: 10, description: 'Total carbohydrates (g)' })
    carbs: number;

    @ApiProperty({ example: 45, description: 'Total protein (g)' })
    protein: number;

    @ApiProperty({ example: 15, description: 'Total fat (g)' })
    fat: number;

    @ApiProperty({ example: 5, description: 'Total dietary fiber (g)' })
    fiber: number;
}
