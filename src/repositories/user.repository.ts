import { Repository } from "typeorm";
import { AppDataSource } from "../db/dataSource";
import { User } from "../entities/User";

export class UserRepository {

    private repository: Repository<User>

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }


    // crear usuario
    async createUser(user: User): Promise<User> {

        return await this.saveUser(user);
    }

    // guardar usuario a la base de datos
    async saveUser(newUser: User): Promise<User> {
        return await this.repository.save(newUser);
    }


    // verificar existencia de un usuario (por ID)
    async verifyUser(userId: number): Promise<User | null> {
        
        const user = await this.repository.findOneBy({ id: userId });

        return user;
    }

    // buscar usuarios existentes
    async searchUsers(): Promise<User[]> {
        const users = await this.repository.find();

        return users;
    }

    // buscar un usuario por username
    async searchUserByUsername(username: string): Promise<User | null> {
        const user = await this.repository.findOne({
            where: { username: username }
        })

        return user;
    }

    // actualizar datos de usuario
    async updateUser(user: User): Promise<User | null> {

        // PRELOAD
        const updatedUser = await this.repository.preload(user);

        if (!updatedUser) {
            return null;
        }

        return await this.saveUser(updatedUser)
    }

    // borrar usuario
    async deleteUser(id: number): Promise<boolean> {
        try {
            const result = await this.repository.delete(id);
            return result.affected !== 0;
        } catch (error: any) {
            if (error.code === '23503') {
                throw error;
            }
            throw error;
        }
    }
}