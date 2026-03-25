import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateWorkoutLogRequestDto {
    @ApiPropertyOptional({ example: 1 })
    sessionId?: number;

    @ApiPropertyOptional({
        description: 'JSON array of exercise performance data',
        example: [
            {
                "exercise id": 1,
                "set1": { "Rep": 12, "Kg": 12 }
            }
        ]
    })
    logData?: any;

    @ApiPropertyOptional({ example: 'Updated notes' })
    notes?: string;
}
