import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

import { LoginUserDto } from '../dtos/userDtos/loginUser.dto';
import { validateDto } from '../utils/dtoUtils/validateDto.util';

export class AuthController{

    private authService: AuthService;

    constructor(service: AuthService){
        this.authService = service;
    };
    
    // POST: login de usuario
    async login(req: Request, res: Response) {

            const body = req.body;

            const dto = await validateDto(LoginUserDto, body);

            const user = await this.authService.login(dto);

            // guardado de access token en cookie
            res.cookie('accessToken', user.accessToken, {
                httpOnly: true,
                secure: false,
                //secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000 // 15 minutos
            });

            // guardado de refresh token en cookie
            res.cookie('refreshToken', user.refreshToken, {
                httpOnly: true,
                secure: false,
                //secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
            });

            // no se exponen los tokens al cliente
            const { accessToken, refreshToken, ...userData } = user;

            return res.status(200).json({ message: 'Login exitoso.', data: userData });

    }

    // POST: logout de usuario
    async logout(_req: Request, res: Response) {
        
        res.clearCookie('accessToken', {
            httpOnly: true,
            secure: false,
            //secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            //secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });

        return res.status(200).json({
            message: 'Logout exitoso.'
        });

    }

    // POST: generar nuevo access token a partir del refresh token
    async refreshToken(req: Request, res: Response) {

            const refreshToken = req.cookies.refreshToken;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token requerido.' });
            }

            const result = await this.authService.refreshToken(refreshToken);

            res.cookie('accessToken', result.accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 15 * 60 * 1000 // 15 minutos
            });

            return res.status(200).json({ message: 'Token renovado.'});

    }
}