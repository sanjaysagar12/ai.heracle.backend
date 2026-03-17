import { ApiPropertyOptional, ApiProperty } from '@nestjs/swagger';

export class SaveTargetsDto {
    @ApiPropertyOptional({ example: 2500, description: 'Target daily calories (kcal)' })
    targetCalories?: number;

    @ApiPropertyOptional({ example: 150, description: 'Target daily protein (g)' })
    targetProtein?: number;

    @ApiPropertyOptional({ example: 250, description: 'Target daily carbohydrates (g)' })
    targetCarbs?: number;

    @ApiPropertyOptional({ example: 70, description: 'Target daily fat (g)' })
    targetFat?: number;

    @ApiPropertyOptional({ example: 35, description: 'Target daily dietary fiber (g)' })
    targetFiber?: number;
}

export class TargetsResponseDto {
    @ApiPropertyOptional({ example: 2500 })
    targetCalories: number | null;

    @ApiPropertyOptional({ example: 150 })
    targetProtein: number | null;

    @ApiPropertyOptional({ example: 250 })
    targetCarbs: number | null;

    @ApiPropertyOptional({ example: 70 })
    targetFat: number | null;

    @ApiPropertyOptional({ example: 35 })
    targetFiber: number | null;

    @ApiPropertyOptional()
    updatedAt: Date | null;
}
