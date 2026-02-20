import { UserRepository } from "../repositories/user.repository";


import { LoginUserDto } from "../dtos/userDtos/loginUser.dto";
import { LoginUserResponseDto } from "../dtos/userDtos/loginUserResponse.dto";

import { mapToDtoResponse } from "../utils/dtoUtils/mapToDtoResponse.util";


import { verifyPassword } from "../utils/authUtils/password.util";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../utils/authUtils/jwtAuth.util";

import { ITokenPayload } from "../interfaces/auth.interface";
import { AppError } from "../utils/errorHandlerUtils/appError";
import { validateUser } from "../utils/validationsUtils/validations.util";

export class AuthService {
    
    // si el sistema escala, se empleará un repositorio propio para mejorar la ciberseguridad
    private userRepository: UserRepository;

    constructor(userRepo: UserRepository) {
        this.userRepository = userRepo;
    }

    // POST: login de usuario
    async login(dto: LoginUserDto): Promise<LoginUserResponseDto> {

        //VALIDACIONES

        // validacion de username
        const user = await this.userRepository.searchUserByUsername(dto.username);

        if (!user) {
            throw new AppError('Los datos ingresados son incorrectos.', 409);
        }

        if(!user.isActive){
            throw new AppError('Su usuario está deshabilitado. No puede usar el sistema.', 403);
        }

        // validacion de contraseña
        const userHashedPassword = user.password;
        const userPlainPassword = dto.password;

        const isSamePassword = await verifyPassword(userPlainPassword, userHashedPassword);

        if (!isSamePassword) {
            throw new AppError('Los datos ingresados son incorrectos.', 409);
        }

        // GENERACION DE TOKEN JWT

        // payload
        const payload = {
            id: user.id,
            role: user.role,
            isActive: user.isActive
        }

        // access token
        const accessToken = generateAccessToken(payload);

        // refresh token
        const refreshToken = generateRefreshToken(payload);

        // retorno de datos del usuario logueado
        const dtoResponse = mapToDtoResponse(LoginUserResponseDto, user)

        dtoResponse.accessToken = accessToken;
        dtoResponse.refreshToken = refreshToken;

        return dtoResponse

    }

    // POST: generar nuevo access token a partir del refresh token
    async refreshToken(token: string) {
        try {
            // verificar refresh token 
            const payload = verifyRefreshToken(token) as ITokenPayload;
            
            const userId = payload.id;

            // validar usuario 
            const user = await validateUser(this.userRepository, userId);

            // generar un nuevo Access Token
            const newPayload = {
                id: user.id,
                role: user.role,
                isActive: user.isActive
            };

            const newAccessToken = generateAccessToken(newPayload);

            return { accessToken: newAccessToken };

        } catch (error) {
            throw new Error('Refresh token inválido o expirado.');
        }
    }
}


