import { User } from "../entities/User";

import { UserRepository } from "../repositories/user.repository";

import { CreateUserDto } from "../dtos/userDtos/createUser.dto"

import { mapToDtoResponse } from "../utils/dtoUtils/mapToDtoResponse.util";
import { UserResponseDto } from "../dtos/userDtos/userResponse.dto";
import { hashPassword, verifyPassword } from "../utils/authUtils/password.util";
import { UpdateUserDto } from "../dtos/userDtos/updateUser.dto";
import { UpdateUserPasswordDto } from "../dtos/userDtos/updateUserPassword.dto";

import { invalidUserMsg } from "../utils/messagesUtils/messages.util";
import { AppError } from "../utils/errorHandlerUtils/appError";
import { validateUser } from "../utils/validationsUtils/validations.util";


export class UserService {
    private userRepository: UserRepository;

    constructor(userRepo: UserRepository) {
        this.userRepository = userRepo;
    }

    // POST: crear nuevo usuario
    async createUser(dto: CreateUserDto): Promise<UserResponseDto> {

        // VALIDACIONES

        // usuario con mismo username
        const existingUser = await this.userRepository.searchUserByUsername(dto.username);

        if (existingUser) {
            throw new AppError(`El nombre de usuario '${dto.username}' ya está en uso. Por favor, elija otro.`, 409);
        }

        // HASH DE CONTRASEÑA
        const hashedPassword = await hashPassword(dto.password);

        // CREACION DE LA ENTIDAD USUARIO
        const userToCreate = new User({
            name: dto.name,
            surname: dto.surname,
            username: dto.username,
            password: hashedPassword,
            role: dto.role
        })

        const userCreated = await this.userRepository.createUser(userToCreate);

        if (!userCreated) {
            throw new AppError('Se produjo un error al crear el usuario.', 409);
        }

        return mapToDtoResponse(UserResponseDto, userCreated)
    }

    // GET: obtener usuarios existentes
    async findAllUsers(): Promise<UserResponseDto[]> {

        const users = await this.userRepository.searchUsers();

        const foundedUsers = users.map(user => mapToDtoResponse(UserResponseDto, user))

        return foundedUsers;

    }

    // GET: obtener perfil de usuario que esta usando el sistema
    async goToUserProfile(userId: number): Promise<UserResponseDto> {

        const user = await validateUser(this.userRepository, userId);

        return mapToDtoResponse(UserResponseDto, user)

    }

    // GET: obtener un usuario por su username
    async searchUsername(username: string): Promise<UserResponseDto> {

        const user = await this.userRepository.searchUserByUsername(username);

        if (!user) {
            throw new AppError(invalidUserMsg(), 404);
        }

        return mapToDtoResponse(UserResponseDto, user)

    }

    // PATCH: actualizar datos del usuario que usa el sistema
    async updateUser(userId: number, dto: UpdateUserDto): Promise<UserResponseDto> {

        //VALIDACIONES

        const currentUser = await validateUser(this.userRepository, userId);

        // validar username duplicado
        if (dto.username && dto.username !== currentUser.username) {
            const usernameExists = await this.userRepository.searchUserByUsername(dto.username);
            if (usernameExists) throw new AppError("El nombre de usuario indicado ya está en uso.", 409);
        }

        // CREACION DEL USUARIO POR ACTUALIZAR
        const userToUpdate = new User({
            id: currentUser.id,
            ...dto
        })

        // ACTUALIZACION DEL USUARIO
        const updatedUser = await this.userRepository.updateUser(userToUpdate)

        if (!updatedUser) {
            throw new AppError('No es posible realizar la actualización de los datos del departamento indicado.', 409);
        }

        return mapToDtoResponse(UserResponseDto, updatedUser)
    }

    // PATCH: actualizar contraseña de un usuario
    async updateUserPassword(userId: number, dto: UpdateUserPasswordDto): Promise<void> {
        //VALIDACIONES
        const currentUser = await validateUser(this.userRepository, userId);

        // validacion de contraseña actual correcta
        const userHashedPassword = currentUser.password;
        const userOldPlainPassword = dto.oldPassword;

        const isSamePassword = await verifyPassword(userOldPlainPassword, userHashedPassword);

        if (!isSamePassword) {
            throw new AppError('La contraseña vieja ingresada no coincide con la actual. No puede cambiar la contraseña.', 403)
        }

        // validacion de nueva contraseña igual a la actual
        const userNewPlainPassword = dto.newPassword;

        const isSameNewPassword = await verifyPassword(userNewPlainPassword, userHashedPassword);

        if (isSameNewPassword) {
            throw new AppError('La nueva contraseña debe ser diferente a la actual.', 409)
        }

        const newHashedPassword = await hashPassword(userNewPlainPassword)

        // CREACION DEL USUARIO POR ACTUALIZAR CONTRASEÑA
        const userToChangePassword = new User({
            id: currentUser.id,
            password: newHashedPassword
        })

        await this.userRepository.updateUser(userToChangePassword)
    }

    // PATCH: deshabilitar usuario (soft delete)
    async disableUser(username: string): Promise<UserResponseDto> {

        //VALIDACIONES
        const currentUser = await this.userRepository.searchUserByUsername(username);

        if (!currentUser) {
            throw new AppError(invalidUserMsg(), 404);
        }

        if (!currentUser.isActive) {
            throw new AppError('El usuario ya está deshabilitado.', 409);
        }

        // CREACION DEL USUARIO POR DESHABILITAR
        const userToDisable = new User({
            id: currentUser.id,
            isActive: false
        })

        const disabledUser = this.userRepository.updateUser(userToDisable);

        if (!disabledUser) {
            throw new AppError('Error al deshabilitar usuario.', 409);
        }

        return mapToDtoResponse(UserResponseDto, disabledUser);
    }

    // PATCH: habilitar usuario 
    async enableUser(username: string): Promise<UserResponseDto> {

        //VALIDACIONES
        const currentUser = await this.userRepository.searchUserByUsername(username);

        if (!currentUser) {
            throw new AppError(invalidUserMsg(), 404);
        }

        if (currentUser.isActive) {
            throw new AppError('El usuario ya está habilitado.', 409);
        }

        // CREACION DEL USUARIO POR DESHABILITAR
        const userToEnable = new User({
            id: currentUser.id,
            isActive: true
        })

        const enabledUser = this.userRepository.updateUser(userToEnable);

        if (!enabledUser) {
            throw new AppError('Error al habilitar usuario.', 409);
        }

        return mapToDtoResponse(UserResponseDto, enabledUser);
    }

    // DELETE: eliminar un usuario (Hard Delete)
    async deleteUser(userId: number, username: string): Promise<void> {

        // VALIDACION
        const targetUser = await this.userRepository.searchUserByUsername(username);

        if (!targetUser) {
            throw new AppError(invalidUserMsg(), 404);
        }

        const targetUserId = targetUser.id;

        if (targetUserId === userId) {
            throw new AppError('No se puede eliminar su propia cuenta.', 403);
        }

        // BORRADO FÍSICO

        const isDeleted = await this.userRepository.deleteUser(targetUserId);

        if (!isDeleted) {
            throw new AppError('El usuario no pudo ser eliminado.', 409);
        }


    }
}