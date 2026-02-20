import { Transform } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { trimString } from '../../utils/dtoUtils/classTransformers.util';


export class UpdateDepartmentDto {
    @IsOptional()
    @IsString({ message: 'El nombre debe ser un texto' })
    @Transform(trimString)
    name!: string;

    @IsOptional()
    @IsString({ message: 'El código debe ser un texto' })
    departmentCode!: string;

    @IsOptional()
    @IsString({ message: 'El nombre debe ser un texto' })
    @Transform(trimString)
    responsibleName!: string;

}

