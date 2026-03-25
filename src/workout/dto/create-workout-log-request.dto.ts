import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateWorkoutLogRequestDto {
    @ApiPropertyOptional({ example: 1, description: 'Optional session ID if this log is part of a session' })
    sessionId?: number;

    @ApiProperty({
        description: 'JSON array of exercise performance data',
        example: [
            {
                "exercise id": 1,
                "set1": { "Rep": 10, "Kg": 10 },
                "note": "Felt good"
            }
        ]
    })
    logData: any;

    @ApiPropertyOptional({ example: 'Great workout today!', description: 'General notes for the workout' })
    notes?: string;
}
