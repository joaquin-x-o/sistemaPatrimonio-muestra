import { UserService } from "../services/user.service";
import { UserRole } from "../enums/user.enums";
import { UserRepository } from "../repositories/user.repository";

export async function seedAdmin(userRepository: UserRepository,userService: UserService): Promise<void> {
    const adminUsername = process.env.ADMIN_USERNAME || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    console.log("Verificando superadmin existente...");

    const existingAdmin = await userRepository.searchUserByUsername(adminUsername);

    if (existingAdmin) {
        console.log(`El usuario '${adminUsername}' ya existe. Saltando proceso de seeding.`);
        return;
    }

    console.log("Creando Super Admin..."); 

    const userCreated = await userService.createUser({
        name: "Super",
        surname: "Admin",
        username: adminUsername,
        password: adminPassword,
        role: UserRole.ADMIN,
    });

    console.log(`Superadmin creado exitosamente: ${userCreated.username}`);
}
