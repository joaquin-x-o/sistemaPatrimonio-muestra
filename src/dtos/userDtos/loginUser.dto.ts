import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { trimString } from '../../utils/dtoUtils/classTransformers.util';

export class LoginUserDto {

  @IsNotEmpty({ message: 'El nombre de usuario es obligatorio.' })
  @IsString({ message: 'El nombre de usuario debe ser un texto.' })
  @Transform(trimString)
  username!: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
  @IsString({ message: 'La contraseña debe ser un texto.' })
  password!: string;

}
