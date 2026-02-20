// inicializacion de los repositorios del sistema

import { ProductRepository } from "../repositories/product.repository";
import { DepartmentRepository } from "../repositories/department.repository";
import { UserRepository } from "../repositories/user.repository";
import { RetirementHistoryRepository } from "../repositories/retirementHistory.repository";
import { MaintenanceHistoryRepository } from "../repositories/maintenanceHistory.repository";
import { MovementHistoryRepository } from "../repositories/movementHistory.repository";

const productRepository = new ProductRepository();
const deptRepository = new DepartmentRepository();
const userRepository = new UserRepository();
const retirementHistoryRepository = new RetirementHistoryRepository();
const movementHistoryRepository = new MovementHistoryRepository()
const maintenanceHistoryRepository = new MaintenanceHistoryRepository();


export {
    productRepository,
    deptRepository,
    userRepository,
    retirementHistoryRepository,
    movementHistoryRepository,
    maintenanceHistoryRepository
}