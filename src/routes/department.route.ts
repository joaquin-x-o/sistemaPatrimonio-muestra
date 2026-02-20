import { Router } from 'express';

import { departmentController } from "../container"
import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';
import { isActiveUser } from '../middlewares/userActive.middleware';

const router = Router();

router.use(authMiddleware, isActiveUser);

// POST: crear un nuevo departamento
router.post('/', adminOnly,(req, res) => departmentController.createDepartment(req, res));

// GET: obtener todos los departamentos
router.get('/', (req, res) => departmentController.getDepartments(req,res));

// GET: obtener un solo departamento por su codigo
router.get('/:departmentCode', (req, res) => departmentController.getDepartmentByCode(req, res));

// PATCH: actualizar datos basicos de un departamento
router.patch('/:departmentCode', adminOnly, (req, res) => departmentController.updateDepartment(req, res));

// PATCH: deshabilitar departamento
router.patch('/:departmentCode/disable', adminOnly, (req, res) => departmentController.disableDepartment(req, res));

// PATCH: habilitar departamento
router.patch('/:departmentCode/enable', adminOnly, (req, res) => departmentController.enableDepartment(req, res));

// DELETE: borrar un departamento
router.delete('/:departmentCode', adminOnly, (req, res) => departmentController.deleteDepartment(req, res));

export default router;