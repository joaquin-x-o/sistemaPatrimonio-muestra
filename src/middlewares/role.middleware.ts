import { Request, Response, NextFunction } from 'express';

import { UserRole } from '../enums/user.enums';
import { AppError } from '../utils/errorHandlerUtils/appError';

// middleware global
export function checkRole(allowedRoles: UserRole[]) {
    return function (req: Request, _res: Response, next: NextFunction
    ) {
        if (!req.user) {
            throw new AppError('Error de autenticación previa.', 401);
        }

        if (allowedRoles.includes(req.user.role)) {
            return next();
        }

        throw new AppError ('No tienes permisos suficientes para realizar esta acción.', 403);
    };
}

// middleware para solo permitir admin
export const adminOnly = checkRole([UserRole.ADMIN]);
