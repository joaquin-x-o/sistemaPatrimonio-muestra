import { IsNotEmpty, IsString, IsNumber, IsOptional, Min, IsDate, IsEnum } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { trimString } from '../../utils/dtoUtils/classTransformers.util';
import { ProductCondition } from '../../enums/product.enums';

export class RepairProductDto {

    @IsNotEmpty({ message: 'Es necesario indicar la condicion actual del producto.' })
    @IsEnum(ProductCondition)
    physicalCondition!: ProductCondition;

    @IsNotEmpty({ message: 'Es obligatorio describir el trabajo de reparación realizado.' })
    @IsString({ message: 'La descripción debe ser un texto.' })
    @Transform(trimString)
    repairDescription!: string;

    @IsOptional()
    @IsNumber({}, { message: 'El costo debe ser un valor numérico.' })
    @Min(0, { message: 'El costo de la reparación no puede ser negativo.' })
    cost?: number;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate({ message: 'La fecha ingresada no es válida.' })
    repairDate: Date = new Date();
}