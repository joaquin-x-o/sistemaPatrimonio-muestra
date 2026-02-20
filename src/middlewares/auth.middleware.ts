import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/authUtils/jwtAuth.util';


import { ITokenPayload } from '../interfaces/auth.interface';
import { AppError } from '../utils/errorHandlerUtils/appError';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {

    // se obtiene el token desde la cookie
    const token = req.cookies?.accessToken

    if (!token) {
        throw new AppError('No se proporcionó token de autenticación.', 401);
        return;
    }

    try {
        // se verifica y decodifica el token
        const decoded = verifyAccessToken(token) as ITokenPayload;

        if (!decoded.id || !decoded.role) {
            throw new AppError ('Token incompleto.', 401);
            return;
        }

        req.user = decoded;
        next();
    } catch {
        throw new AppError ( 'Token inválido o expirado.', 401);
    }
}

