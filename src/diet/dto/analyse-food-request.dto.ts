import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * Multipart/form-data request for the AI food analysis endpoint.
 * At least one of image or description must be provided.
 */
export class AnalyseFoodRequestDto {
    @ApiPropertyOptional({
        type: 'string',
        format: 'binary',
        description: 'Image of the food (JPEG/PNG). At least one of image or description is required.',
    })
    image?: Express.Multer.File;

    @ApiPropertyOptional({
        example: '2 boiled eggs and a slice of whole wheat toast',
        description: 'Text description of the food. At least one of image or description is required.',
    })
    description?: string;
}
