import { Request, Response } from 'express';

import { UserService } from '../services/user.service';

import { validateDto } from '../utils/dtoUtils/validateDto.util';
import { CreateUserDto } from '../dtos/userDtos/createUser.dto';

import { UpdateUserDto } from '../dtos/userDtos/updateUser.dto';
import { UpdateUserPasswordDto } from '../dtos/userDtos/updateUserPassword.dto';

export class UserController {
    private userService: UserService;

    constructor(service: UserService) {
        this.userService = service;
    }

    // POST: crear usuario
    async createUser(req: Request, res: Response) {

        const body = req.body;

        const dto = await validateDto(CreateUserDto, body);

        const newUser = await this.userService.createUser(dto);

        return res.status(201).json({ message: 'Usuario creado correctamente.', data: newUser });


    }

    // GET: obtener todos los usuarios creados
    async getUsers(_req: Request, res: Response) {

        const users = await this.userService.findAllUsers();
        return res.status(201).json({ data: users });

    }

    // GET: ir a perfil de usuario
    async getMyUser(req: Request, res: Response) {

        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado o token inválido' });
        };

        const user = await this.userService.goToUserProfile(userId);

        return res.status(201).json({ message: 'Usuario encontrado.', data: user });

    }

    // GET: buscar un usuario por su username
    async getUser(req: Request, res: Response) {

        const { username } = req.params;

        const user = await this.userService.searchUsername(username);

        return res.status(201).json({ message: 'Usuario encontrado.', data: user });

    }

    // PATCH: actualizar datos del usuario que usa el sistema
    async updateUser(req: Request, res: Response) {

        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado o token inválido' });
        };

        const body = req.body;

        const dto = await validateDto(UpdateUserDto, body);

        const updatedUser = await this.userService.updateUser(userId, dto);

        return res.status(201).json({ message: 'Usuario actualizado.', data: updatedUser });

    }

    // PATCH: actualizar contraseña de un usuario
    async updatePassword(req: Request, res: Response) {

        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado o token inválido' });
        }
        const body = req.body;

        const dto = await validateDto(UpdateUserPasswordDto, body);

        await this.userService.updateUserPassword(userId, dto);

        return res.status(201).json({ message: 'Contraseña actualizada.' });


    }

    // PATCH: deshabilitar usuario
    async disableUser(req: Request, res: Response) {

        const { username } = req.params;

        const disabledUser = await this.userService.disableUser(username);
        return res.status(200).json({ message: 'Usuario deshabilitado.', data: disabledUser });

    }

    // PATCH: habilitar usuario
    async enableUser(req: Request, res: Response) {

        const { username } = req.params;

        const enabledUser = await this.userService.enableUser(username);
        return res.status(200).json({ message: 'Usuario habilitado.', data: enabledUser });

    }

    // DELETE: borrar un usuario
    async deleteUser(req: Request, res: Response) {

        const { username } = req.params;
        const userId = req.user?.id

        if (!userId) {
            return res.status(401).json({ message: 'Usuario no autenticado o token inválido' });
        }

        await this.userService.deleteUser(userId, username);

        return res.status(200).json({ message: 'Usuario eliminado.' });

    }

}