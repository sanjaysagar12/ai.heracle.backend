import { ApiProperty } from '@nestjs/swagger';

export class ExerciseListResponseDto {
    @ApiProperty({ example: 1 })
    id: number;

    @ApiProperty({ example: 'Bench Press' })
    name: string;

    @ApiProperty({ example: 'Chest, Triceps, Shoulders' })
    secondaryInfo: string;

    @ApiProperty({ example: 'Strength' })
    exerciseType: string;

    @ApiProperty({ example: 'https://r2.heracle.fit/exercises/1.jpg' })
    image: string;
}
