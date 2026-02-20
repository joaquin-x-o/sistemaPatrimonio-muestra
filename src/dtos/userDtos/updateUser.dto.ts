import { IsNotEmpty, IsString, IsEnum, IsOptional} from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from '../../enums/user.enums';
import { trimString } from '../../utils/dtoUtils/classTransformers.util';

export class UpdateUserDto {

    @IsOptional()
    @IsString({ message: 'El nombre debe ser un texto.' })
    @Transform(trimString)
    name!: string;

    @IsOptional()
    @IsString({ message: 'El apellido debe ser un texto.' })
    @Transform(trimString)
    surname!: string;

    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
    @IsString({ message: 'El nombre de usuario debe ser un texto.' })
    @Transform(trimString)
    username!: string;

    @IsOptional()
    @IsEnum(UserRole, { message: 'El rol indicado no es válido.' })
    role!: UserRole;
}