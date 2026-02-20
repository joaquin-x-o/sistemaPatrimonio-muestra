import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandlerUtils/appError';

export const globalErrorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {

    let error = err;

    error.statusCode = error.statusCode || 500;
    error.status = error.status || 'error';

    // ERRORES DE BASE DE DATOS

    // Código 23505: dato duplicado 
    if (error.code === '23505') error = handleDuplicateFieldsDB(error);

    // Código 23503: violación de llave foránea 
    if (error.code === '23503') error = handleForeignKeyConstraintDB(error);

    // Código 22P02: tipo de dato inválido
    if (error.code === '22P02') error = handleInvalidDataTypeDB(error);

    // Código 22001: el valor es demasiado largo para la columna
    if (error.code === '22001') error = handleValueTooLongDB(error);

    // ERRORES OPERACIONALES CREADOS CON AppError
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    }

    // ERRORES INTERNOS
    console.error('ERROR: ', err);

    return res.status(500).json({
        status: 'error',
        message: 'Error interno del servidor.'
    });
};


// Errores especificos de base de datos

const handleInvalidDataTypeDB = (err: any) => {
    const message = `Dato inválido: ${err.path}: ${err.value}.`;
    return new AppError(message, 400);
}


const handleDuplicateFieldsDB = (_err: any) => {
    return new AppError('El registro ya existe (dato duplicado).', 409);
}

const handleForeignKeyConstraintDB = (_err: any) => {
    const message = 'No se puede realizar esta operación porque el registro está vinculado a otros datos.';
    return new AppError(message, 400);
}

const handleValueTooLongDB = (_err: any) => {
    return new AppError('Uno de los campos excede la longitud máxima permitida.', 400);
}