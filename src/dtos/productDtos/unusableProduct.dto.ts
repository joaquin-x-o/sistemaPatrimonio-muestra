import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimString } from '../../utils/dtoUtils/classTransformers.util';
import { ProductCondition } from '../../enums/product.enums';

export class UnusableProductDto {

    @IsNotEmpty({ message: 'Es necesario indicar el motivo por el que el producto ya no se puede usar.' })
    @IsString({ message: 'La descripción debe ser un texto' })
    @Transform(trimString)
    unusableReason!: string;

    @IsNotEmpty({ message: 'Es necesario indicar la condicion actual del producto.' })
    @IsEnum(ProductCondition)
    physicalCondition!: ProductCondition;
}