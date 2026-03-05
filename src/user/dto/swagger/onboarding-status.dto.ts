import { ApiProperty } from '@nestjs/swagger';

export class OnboardingStatusDto {
    @ApiProperty({ example: true, description: 'True if age, gender, height, weight, or goal are missing' })
    bodyMetricsNeeded: boolean;

    @ApiProperty({ example: false, description: 'True if dietary preference or meals per day are missing' })
    dietDataNeeded: boolean;
}
