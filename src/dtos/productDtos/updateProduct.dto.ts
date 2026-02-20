import { IsString, IsNumber, IsOptional, IsEnum, IsDate, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ProductCategory, ProductCondition } from "../../enums/product.enums";
import { trimString } from '../../utils/dtoUtils/classTransformers.util';

export class UpdateProductDto {

    @IsOptional() 
    @IsString({ message: 'El nombre debe ser un texto.' })
    @Transform(trimString)
    name?: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto.' })
    @Transform(trimString)
    description?: string;

    @IsOptional()
    @IsString({ message: 'La descripción debe ser un texto.' })
    @Transform(trimString)
    observation?: string;

    @IsOptional()
    @IsNumber({}, { message: 'El código de producto debe ser un número.' })
    productCode?: number;

    @IsOptional()
    @IsBoolean()
    isMSM?: boolean;

    @IsOptional()
    @IsEnum(ProductCategory, { message: 'La categoría indicada no es válida.' })
    category?: ProductCategory;

    @IsOptional()
    @IsEnum(ProductCondition, { message: 'La condición física indicada no es válida.' })
    physicalCondition?: ProductCondition;

    @IsOptional()
    @Type(() => Date) // Convierte string a Date si viene el dato
    @IsDate({ message: 'La fecha de registro no es válida.' })
    registrationDate?: Date;
}