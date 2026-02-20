import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty } from "class-validator";

export class BulkProductCodeDto {

    @IsNotEmpty()
    @IsArray({message: 'Debe enviar una lista de códigos de productos por transferir'})
    @Type(() => Number)
    @IsInt({ each: true})
    productCodes!: number[] ;
}