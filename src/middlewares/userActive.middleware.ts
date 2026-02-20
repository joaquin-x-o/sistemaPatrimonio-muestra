import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errorHandlerUtils/appError';


// middleware global
export function checkUserAvailability() {
    return function (req: Request, _res: Response, next: NextFunction
    ) {
        if (!req.user) {
            throw new AppError('Error de autenticación previa.', 401);
        }

        if (req.user.isActive) {
            return next();
        }

        throw new AppError('El usuario no se encuentra activo, no puede acceder al sistema.', 403);
    };
}

// middleware para verificar que el usuario esté activo en el sistema
export const isActiveUser = checkUserAvailability();
