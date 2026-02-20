import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { trimString } from '../../utils/dtoUtils/classTransformers.util';


export class CreateDepartmentDto {
    @IsNotEmpty({ message: 'Debe indicar el nombre del departamento' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @Transform(trimString)
    name!: string;

    @IsNotEmpty({ message: 'Debe indicar el código del departamento' })
    @IsString({ message: 'El código debe ser un texto' })
    @Transform(trimString)
    departmentCode!: string;

    @IsNotEmpty({ message: 'Debe indicar el nombre del encargado del departamento' })
    @IsString({ message: 'El nombre debe ser un texto' })
    @Transform(trimString)
    responsibleName!: string;

}

