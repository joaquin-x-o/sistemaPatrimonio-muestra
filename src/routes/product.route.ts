import { Router } from 'express';

import { productController } from "../container"


import { authMiddleware } from '../middlewares/auth.middleware';
import { adminOnly } from '../middlewares/role.middleware';
import { isActiveUser } from '../middlewares/userActive.middleware';

const router = Router();

router.use(authMiddleware, isActiveUser);

// BULK ENDPOINTS ---------

// PATCH: obtener productos antes de su modificacion simultanea (bulk preview)
router.patch('/bulk-preview/:bulkaction', adminOnly,(req, res) => productController.bulkPreviewProducts(req, res));

// PATCH: trasferir mas de un producto a otro departamento
router.patch('/bulk-transfer', adminOnly, (req, res) => productController.bulkTransferProducts(req, res));

// PATCH: verificar fisicamente mas de un producto
router.patch('/bulk-check', adminOnly, (req, res) => productController.bulkCheckProducts(req, res));

// PATCH: dar de baja a mas de un producto
router.patch('/bulk-retire', adminOnly, (req, res) => productController.bulkRetireProducts(req, res));

// PATCH: marcar mas de un producto como averiado/fuera de uso
router.patch('/bulk-unusable', adminOnly, (req, res) => productController.bulkMarkProductsAsUnusable(req, res));

// PATCH: reparar mas de un producto
router.patch('/bulk-repair', adminOnly, (req, res) => productController.bulkRepairProducts(req, res))

// CRUD --------

// POST: crear un nuevo producto
router.post('/', adminOnly, (req, res) => productController.createProduct(req, res));

// GET: obtener todos los productos (paginado)
router.get('/', (req, res) => productController.getProducts(req, res));

// GET: obtener un solo producto por su codigo
router.get('/:productCode', (req, res) => productController.getProductByCode(req, res));

// PATCH: actualizar un producto
router.patch('/:productCode', adminOnly, (req, res) => productController.updateProduct(req, res));

// DELETE: borrar un producto
router.delete('/:productCode', adminOnly, (req, res) => productController.deleteProduct(req, res));

// ACTUALIZACION DE ESTADOS DE UN OBJETO --------

// PATCH: dar de baja un producto (Soft Delete)
router.patch('/:productCode/retire', adminOnly, (req, res) => productController.retireProduct(req, res)); 

// PATCH: reactivar producto (volver a dar de alta un producto dado de baja)
router.patch('/:productCode/reactivate', adminOnly, (req, res) => productController.reactivateProduct(req, res));

// PATCH: asignar un producto a revision
router.patch('/:productCode/review',  adminOnly, (req, res) => productController.sendProductToReview(req, res));

// PATCH: aprobar un producto tras ser revisado
router.patch('/:productCode/approve', adminOnly, (req, res) => productController.approveProduct(req, res));

// PATCH: marcar un producto como averiado/fuera de uso
router.patch('/:productCode/unusable', adminOnly, (req, res) => productController.markProductAsUnusable(req, res));

// PATCH: reparar un producto averiado/volver a habilitar producto fuera de uso
router.patch('/:productCode/repair', adminOnly, (req, res) => productController.repairProduct(req, res));

// PATCH: transferir un producto a otro departamento
router.patch('/:productCode/transfer', adminOnly, (req, res) => productController.transferProduct(req, res));


// PATCH: verificar la existencia fisica de un producto
router.patch('/:productCode/check' , adminOnly, (req, res) => productController.checkProduct(req, res));


// OTRAS CONSULTAS --------

// GET: obtener productos de un departamento en particular
router.get('/by-department/:departmentCode', (req, res) => productController.getProductsByDepartment(req, res))

// GET: obtener el historial de movimientos de un producto
router.get('/:productCode/movement-history', (req, res) => productController.getProductMovementHistory(req, res))

// GET: obtener el historial de mantenimiento de un producto
router.get('/:productCode/maintenance-history', (req, res) => productController.getProductMaintenanceHistory(req, res))


export default router;