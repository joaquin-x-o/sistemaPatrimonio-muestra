import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimString } from '../../utils/dtoUtils/classTransformers.util';

export class ReviewProductDto {
    
    @IsNotEmpty({ message: 'Es obligatorio indicar el motivo de la revisión.' })
    @IsString({ message: 'El motivo debe ser un texto.' })
    @Transform(trimString)
    pendingReviewReason!: string;
}