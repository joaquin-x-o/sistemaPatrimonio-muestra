// Creación del AuthController
import { AuthController } from "../controllers/auth.controller";

import { AuthService } from "../services/auth.service";
import { userRepository } from "./repositories.container";

const authService = new AuthService (userRepository);

const authController = new AuthController (authService);

export {authController}