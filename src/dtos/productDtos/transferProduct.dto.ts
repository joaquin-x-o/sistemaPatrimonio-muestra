import { IsNotEmpty, IsString, IsDate } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { trimString } from '../../utils/dtoUtils/classTransformers.util';

export class TransferProductDto {

    @IsNotEmpty({ message: 'Es necesario indicar el departamento destino del producto.' })
    @IsString({ message: 'El código de departamento debe ser texto.' })
    @Transform(trimString)
    destinationDepartmentCode!: string;

    @IsNotEmpty({ message: 'Es obligatorio indicar el motivo por el cual el producto es transferido.' })
    @IsString()
    @Transform(trimString)
    reasonForMovement!: string;

    @IsNotEmpty()
    @Type(() => Date)
    @IsDate({ message: 'La fecha de transferencia no es válida.' })
    transferDate: Date = new Date(); 
}