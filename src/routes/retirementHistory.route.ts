import { Router } from 'express';

import { retirementHistoryController } from "../container"
import { authMiddleware } from '../middlewares/auth.middleware';
import { isActiveUser } from '../middlewares/userActive.middleware';

const router = Router();

router.use(authMiddleware, isActiveUser);

// GET: obtener todos los registros del historial de bajas
router.get('/', (req, res) => retirementHistoryController.getRetirementHistoryEntries(req,res));

export default router;