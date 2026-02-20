import { Router } from 'express';

import { userController } from '../container';
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';
import { isActiveUser } from '../middlewares/userActive.middleware';

const router = Router();

router.use(authMiddleware, isActiveUser)

// POST: crear usuario
router.post('/', adminOnly, (req, res) => userController.createUser(req, res));

// GET: obtener todos los usuarios
router.get('/', adminOnly, (req, res) => userController.getUsers(req, res));

// GET: ir a perfil de usuario 
router.get('/me', (req, res) => userController.getMyUser(req, res));

// GET: buscar un usuario por su username
router.get('/:username', adminOnly, (req,res) => userController.getUser(req,res));

// PATCH: actualizar datos del usuario que usa el sistema
router.patch('/', (req, res) => userController.updateUser(req, res));

// PATCH: actualizar contraseña de un usuario
router.patch('/change-password', (req, res) => userController.updatePassword(req, res));

// PATCH: deshabilitar usuario
router.patch('/:username/disable', adminOnly, (req, res) => userController.disableUser(req, res));

// PATCH: habilitar usuario 
router.patch('/:username/enable', adminOnly, (req, res) => userController.enableUser(req, res));

// DELETE: borrar usuario
router.delete('/:username', adminOnly, (req, res) => userController.deleteUser(req, res));


export default router;
