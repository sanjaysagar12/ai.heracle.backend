import { ApiProperty } from '@nestjs/swagger';

class NutrientsDto {
    @ApiProperty({ example: 2000 })
    calories: number;

    @ApiProperty({ example: 150.5 })
    protein: number;

    @ApiProperty({ example: 250.0 })
    carbs: number;

    @ApiProperty({ example: 65.0 })
    fat: number;

    @ApiProperty({ example: 30.0 })
    fiber: number;
}

export class DailyNutritionalStatusDto {
    @ApiProperty({ type: NutrientsDto })
    targets: NutrientsDto;

    @ApiProperty({ type: NutrientsDto })
    consumed: NutrientsDto;
}
