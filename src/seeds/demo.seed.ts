import { UserService } from "../services/user.service";
import { ProductService } from "../services/product.service";
import { DepartmentService } from "../services/department.service";
import { UserRole } from "../enums/user.enums";
import { ProductCategory, ProductCondition } from "../enums/product.enums";
import { CreateProductDto } from "../dtos/productDtos/createProduct.dto";
import { DepartmentRepository } from "../repositories/department.repository";
import { ProductRepository } from "../repositories/product.repository";
import { UserRepository } from "../repositories/user.repository";



export async function seedDemoData(userService: UserService, userRepository: UserRepository, productService: ProductService, productRepository:ProductRepository, departmentService: DepartmentService, departmentRepository: DepartmentRepository): Promise<void> {
    console.log("Iniciando carga de datos para el uso de la demo.");

    // CARGA DE DEPARTAMENTOS
    console.log("Cargando departamentos...");

    const demoDepartments =
        [
            {
                name: "Dirección de Patrimonio",
                departmentCode: "B2",
                responsibleName: "Ricardo Gutiérrez"
            },
            {
                name: "Secretaría de Cultura",
                departmentCode: "C1",
                responsibleName: "Carlos Ruiz"
            },
            {
                name: "Dirección de Tránsito",
                departmentCode: "D4",
                responsibleName: "Ana Sofía Méndez"
            }
        ];

    for (const dept of demoDepartments) {
        const existing = await departmentRepository.searchDepartmentByCode(dept.departmentCode);

        if (!existing) {
            await departmentService.createDepartment(dept);
            console.log(`Departamento creado: ${dept.name}`);
        } else {
            console.log(`Departamento ya existe: ${dept.name}`);
        }
    }

    console.log("Departamentos cargados exitosamente.");

    // CARGA DE USUARIOS
    console.log("Cargando usuarios...");


    const demoUsers = [
        {
            name: 'Ricardo',
            surname: 'Gutiérrez',
            username: 'rgutierrez',
            password: 'ricardogutierrez',
            role: UserRole.ADMIN,
        },
        {
            name: 'Mónica',
            surname: 'Vásquez',
            username: 'mvasquez',
            password: 'monicavasquez',
            role: UserRole.ADMIN,
        },
        {
            name: 'Francisco',
            surname: 'Soler',
            username: 'fsoler',
            password: 'franciscosoler',
            role: UserRole.VIEWER,
        },
    ];

    for (const user of demoUsers) {
        const existing = await userRepository.searchUserByUsername(user.username);

        if (!existing) {
            await userService.createUser(user);
            console.log(`Usuario demo creado: ${user.username}`);
        } else {
            console.log(`Usuario ya existe: ${user.username}`);
        }
    }

    console.log("Usuarios cargados exitosamente.");

    // CARGA DE PRODUCTOS
    console.log("Cargando usuarios...");


    // Usuarios ADMINS que cargaron los productos
    const adminOne = await userService.searchUsername('rgutierrez');
    const adminOneId = Number(adminOne.id);

    const adminTwo = await userService.searchUsername('mvasquez');
    const adminTwoId = Number(adminTwo.id);


    // Productos en Direccion de Patrimonio (B2)
    const patrimonioDept = await departmentService.findOneDepartmentByCode("B2");

    if (patrimonioDept) {
        const patrimonioProducts = [
            {
                name: 'PC de Escritorio - Puesto Administrativo',
                description: 'CPU Intel i5, 16GB RAM, Monitor 22" LG',
                productCode: 2,
                departmentCode: patrimonioDept.departmentCode,
                observation: 'Estación principal para carga de inventario',
                isMSM: true,
                category: ProductCategory.IT,
                physicalCondition: ProductCondition.GOOD,
                registrationDate: new Date(2024, 2, 10),
            },
            {
                name: 'Notebook Lenovo ThinkPad',
                description: 'Laptop 14" Ryzen 5, 8GB RAM',
                productCode: 3,
                departmentCode: patrimonioDept.departmentCode,
                observation: 'Asignada al Director para auditorías externas',
                isMSM: true,
                category: ProductCategory.IT,
                physicalCondition: ProductCondition.NEW,
                registrationDate: new Date(2024, 5, 15),
            },
            {
                name: 'Notebook HP ProBook',
                description: 'Laptop 15.6" i3, 8GB RAM',
                productCode: 4,
                departmentCode: patrimonioDept.departmentCode,
                observation: 'Uso compartido para relevamientos de campo',
                isMSM: true,
                category: ProductCategory.IT,
                physicalCondition: ProductCondition.GOOD,
                registrationDate: new Date(2023, 11, 20),
            },
            {
                name: 'Archivo de Acero 4 Cajones',
                description: 'Fichero para carpetas colgantes tamaño oficio',
                productCode: 5,
                departmentCode: patrimonioDept.departmentCode,
                observation: 'Contiene expedientes históricos de bajas de activos',
                isMSM: true,
                category: ProductCategory.FURNITURE,
                physicalCondition: ProductCondition.GOOD,
                registrationDate: new Date(2023, 10, 5),
            },
            {
                name: 'Escritorio de Melamina con Cajonera',
                description: 'Escritorio operativo de 1.20m color Haya',
                productCode: 6,
                departmentCode: patrimonioDept.departmentCode,
                observation: 'Puesto de trabajo del Auxiliar de Patrimonio',
                isMSM: true,
                category: ProductCategory.FURNITURE,
                physicalCondition: ProductCondition.REGULAR,
                registrationDate: new Date(2024, 1, 15),
            },
        ];

       await uploadProducts(patrimonioProducts, productService, productRepository, adminOneId);

    }

    // Productos en Secreataria de Cultura (C1)
    const culturaDept = await departmentService.findOneDepartmentByCode("C1");

    if (culturaDept) {
        const culturaProducts = [
            {
                name: 'Proyector Epson PowerLite',
                description: 'Proyector 3LCD de 3600 lúmenes con entrada HDMI',
                productCode: 101,
                departmentCode: culturaDept.departmentCode,
                observation: 'Ubicado en el Auditorio Principal para ciclos de cine',
                isMSM: true,
                category: ProductCategory.ELECTRONICS,
                physicalCondition: ProductCondition.GOOD,
                registrationDate: new Date(2024, 3, 12),
            },
            {
                name: 'Aire Acondicionado Split 6000FG',
                description: 'Equipo Surrey Industrial Frío/Calor',
                productCode: 102,
                departmentCode: culturaDept.departmentCode,
                observation: 'Instalado en la Galería de Arte - Control de clima',
                isMSM: true,
                category: ProductCategory.INSTALLATIONS,
                physicalCondition: ProductCondition.EXCELLENT,
                registrationDate: new Date(2023, 11, 28),
            },
            {
                name: 'Cuadro Óleo "Paisaje Regional"',
                description: 'Obra de autor local, marco de madera tallada',
                productCode: 103,
                departmentCode: culturaDept.departmentCode,
                observation: 'Expuesto en el Hall de Entrada - Valor histórico',
                isMSM: true,
                category: ProductCategory.ARTWORK,
                physicalCondition: ProductCondition.GOOD,
                registrationDate: new Date(2022, 5, 10),
            },
            {
                name: 'Notebook HP ProBook',
                description: 'Laptop 15.6" i3, 8GB RAM',
                productCode: 104,
                departmentCode: culturaDept.departmentCode,
                observation: 'Puesto de informes y venta de entradas en recepción',
                isMSM: true,
                category: ProductCategory.IT,
                physicalCondition: ProductCondition.GOOD,
                registrationDate: new Date(2024, 0, 15),
            },
            {
                name: 'Cafetera de Filtro Industrial',
                description: 'Capacidad 10 litros con canilla dispensadora',
                productCode: 105,
                departmentCode: culturaDept.departmentCode,
                observation: 'Uso en coffee breaks de talleres y seminarios',
                isMSM: true,
                category: ProductCategory.APPLIANCES,
                physicalCondition: ProductCondition.REGULAR,
                registrationDate: new Date(2023, 8, 5),
            },
        ];

        await uploadProducts(culturaProducts, productService, productRepository, adminOneId);

    }

    // Productos en Direccion de Transito (D4)
    const transitoDept = await departmentService.findOneDepartmentByCode("D4");

    if (transitoDept) {
        const transitoProducts = [
            {
                name: 'Camioneta Pick-up de Patrullaje',
                description: 'Ford Ranger Blanca - Interno T-04 con balizas LED',
                productCode: 201,
                departmentCode: transitoDept.departmentCode,
                observation: 'Unidad activa para operativos de control nocturno',
                isMSM: true,
                category: ProductCategory.VEHICLES,
                physicalCondition: ProductCondition.GOOD,
                registrationDate: new Date(2023, 5, 10),
            },
            {
                name: 'Motocicleta de Operativos',
                description: 'Honda XR 250cc - Interno M-02',
                productCode: 202,
                departmentCode: transitoDept.departmentCode,
                observation: 'Asignada a cuerpo de inspectores motorizados',
                isMSM: true,
                category: ProductCategory.VEHICLES,
                physicalCondition: ProductCondition.GOOD,
                registrationDate: new Date(2024, 1, 15),
            },
            {
                name: 'Alcoholímetro Digital Homologado',
                description: 'Sensor electroquímico de alta precisión con impresora bluetooth',
                productCode: 203,
                departmentCode: transitoDept.departmentCode,
                observation: 'Requiere calibración semestral - Próxima: Julio 2024',
                isMSM: true,
                category: ProductCategory.ELECTRONICS,
                physicalCondition: ProductCondition.EXCELLENT,
                registrationDate: new Date(2024, 0, 5),
            },
            {
                name: 'Conos de Señalización (Lote x20)',
                description: 'Conos reflectantes de 70cm para desvíos',
                productCode: 204,
                departmentCode: transitoDept.departmentCode,
                observation: 'Almacenados en depósito para cortes de calle',
                isMSM: true,
                category: ProductCategory.OTHER,
                physicalCondition: ProductCondition.REGULAR,
                registrationDate: new Date(2023, 10, 20),
            },
            {
                name: 'Impresora de Licencias de Conducir',
                description: 'Impresora térmica Zebra para tarjetas PVC',
                productCode: 205,
                departmentCode: transitoDept.departmentCode,
                observation: 'Ubicada en box de atención al público',
                isMSM: true,
                category: ProductCategory.IT,
                physicalCondition: ProductCondition.GOOD,
                registrationDate: new Date(2023, 11, 2),
            },
        ];

        await uploadProducts(transitoProducts, productService, productRepository, adminTwoId);

    }

    console.log("Productos cargados exitosamente.");

    console.log("Todos los datos fueron cargados correctamente.");
}

async function uploadProducts(products: CreateProductDto[], productService: ProductService, productRepository: ProductRepository, userId: number) {

    for (const product of products) {
        const existing = await productRepository.searchProductByCode(product.productCode);

        if (!existing) {
            await productService.createProduct(userId, product);
            console.log(`Producto creado: ${product.name}`);
        } else {
            console.log(`Producto ya existe: ${product.name}`);
        }
    }
}