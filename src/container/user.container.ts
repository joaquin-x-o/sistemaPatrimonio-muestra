// Creación del UserController
import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";
import { userRepository } from "./repositories.container";

const userService = new UserService (userRepository);

const userController = new UserController (userService);

export {userController}