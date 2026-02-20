// Creación del ProductController
import { ProductController } from "../controllers/product.controller";
import { ProductService } from "../services/product.service";
import { productRepository, deptRepository, userRepository, retirementHistoryRepository, movementHistoryRepository, maintenanceHistoryRepository } from "./repositories.container";

const productService = new ProductService(productRepository,
    deptRepository,
    userRepository,
    retirementHistoryRepository,
    movementHistoryRepository,
    maintenanceHistoryRepository);

const productController = new ProductController (productService);


export {productController}