// Creación del DepartmentController
import { DepartmentController } from "../controllers/department.controller";
import { DepartmentService } from "../services/department.service";
import { deptRepository, productRepository} from "./repositories.container";

const departmentService = new DepartmentService(deptRepository, productRepository);

const departmentController = new DepartmentController (departmentService);

export {departmentController}