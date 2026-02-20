import { Router } from 'express';
import productRoutes from './product.route';
import departmentRoutes from './department.route';
import userRoutes from './user.route';
import authRoutes from './auth.route'
import retirementHistoryRoutes from './retirementHistory.route';

const router = Router();

router.use('/auth', authRoutes)
router.use('/users', userRoutes);
router.use('/products', productRoutes);
router.use('/departments', departmentRoutes);

router.use('/retirement-history', retirementHistoryRoutes);


export default router;