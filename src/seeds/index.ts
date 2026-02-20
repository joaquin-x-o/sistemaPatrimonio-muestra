import { AppDataSource } from '../db/dataSource';


import { userRepository } from '../container/repositories.container';
import { deptRepository } from '../container/repositories.container';
import { productRepository } from '../container/repositories.container';
import { retirementHistoryRepository } from '../container/repositories.container';
import { movementHistoryRepository } from '../container/repositories.container';
import { maintenanceHistoryRepository } from '../container/repositories.container';


import { DepartmentService } from '../services/department.service';
import { ProductService } from '../services/product.service';
import { UserService } from '../services/user.service';

import { seedAdmin } from './admin.seed';
import { seedDemoData } from './demo.seed';



async function runSeed(){
    try {
        // conexion a la db
        await AppDataSource.initialize()
        
        
        // inicializacion de servicios
        const userService = new UserService(userRepository);
        const departmentService = new DepartmentService(deptRepository, productRepository);
        const productService = new ProductService(productRepository, deptRepository, userRepository, retirementHistoryRepository, movementHistoryRepository, maintenanceHistoryRepository);

        //  NOTA: En caso de iniciar el sistema como demo, se cargaran algunos datos de prueba. Caso contrario, solo se creará el superadmin.

        // npm run seed --demo
        const isDemo = process.argv.includes("--demo");

        console.log('Ejecutando seed principal: creación de superadmin.');

        await seedAdmin(userRepository, userService)
        
        if (isDemo) {
            console.log('Ejecutando seed demo: carga de datos de prueba.');
            await seedDemoData(userService, userRepository, productService, productRepository, departmentService, deptRepository);
            console.log('El sistema ya contiene datos para probar el sistema.')
        } else {
            console.log('El sistema ya está apto para usar en produccion.')
        }


        console.log("Seeding finalizado correctamente");

        await AppDataSource.destroy();
        process.exit(0);
        
    } catch (error: any) {
        console.error('Error en seed:', error);
        process.exit(1);
    }
}

runSeed()