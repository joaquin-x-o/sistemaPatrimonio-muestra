import { Router } from 'express';

import { authController } from '../container';
import { isActiveUser } from '../middlewares/userActive.middleware';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();


// POST: login de usuario
router.post('/login', (req, res) => authController.login(req, res));

// POST: logout de usuario
router.post('/logout', authMiddleware ,isActiveUser, (req, res) => authController.logout(req, res));

// POST: refresh de token
router.post('/refresh', authMiddleware, isActiveUser, (req, res) => authController.refreshToken(req, res));

export default router