import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AppError } from '../errorHandlerUtils/appError';

export async function validateDto<T extends object>(
    dtoClass: new () => T,
    body: unknown
): Promise<T> {

    // Convierte el body plano en una instancia del DTO y transforma tipos automáticamente
    const dtoInstance = plainToInstance(dtoClass, body, {
        enableImplicitConversion: true
    });

    
    // Valida el DTO y bloquea propiedades no definidas
    const errors: ValidationError[] = await validate(dtoInstance, {
        whitelist: true,
        forbidNonWhitelisted: true
    });

    // Si hay errores de validación, se formatea un mensaje legible
    if (errors.length > 0) {
        const errorMessages = errors
            .map(error =>
                `${error.property}: ${Object.values(error.constraints ?? {}).join(', ')}`
            )
            .join(' | ');

        throw new AppError(`Error de Validación: ${errorMessages}`, 400);
    }

    // Retorna el DTO validado y seguro para la capa de servicio
    return dtoInstance;
}
