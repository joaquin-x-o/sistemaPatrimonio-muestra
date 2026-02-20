// Repositorios
import { ProductRepository } from "../repositories/product.repository";
import { DepartmentRepository } from "../repositories/department.repository";
import { UserRepository } from "../repositories/user.repository";
import { RetirementHistoryRepository } from "../repositories/retirementHistory.repository";
import { MaintenanceHistoryRepository } from "../repositories/maintenanceHistory.repository";
import { MovementHistoryRepository } from "../repositories/movementHistory.repository";

import { Product } from "../entities/Product";
import { MovementHistory } from "../entities/MovementHistory";
import { RetirementHistory } from "../entities/RetirementHistory";
import { MaintenanceHistory } from "../entities/MaintenanceHistory";

import { CreateProductDto } from "../dtos/productDtos/createProduct.dto";
import { ProductResponseDto } from "../dtos/productDtos/productResponse.dto"
import { UpdateProductDto } from "../dtos/productDtos/updateProduct.dto";
import { RetireProductDto } from "../dtos/productDtos/retireProduct.dto";
import { ReviewProductDto } from "../dtos/productDtos/reviewProduct.dto";
import { UnusableProductDto } from "../dtos/productDtos/unusableProduct.dto";
import { TransferProductDto } from "../dtos/productDtos/transferProduct.dto";
import { BulkTransferProductDto } from "../dtos/productDtos/bulkTransferProducts.dto";
import { RepairProductDto } from "../dtos/productDtos/repairProduct.dto";
import { MovementHistoryResponseDto } from "../dtos/historyDtos/movementHistoryResponse.dto";
import { MaintenanceHistoryResponseDto } from "../dtos/historyDtos/maintenanceHistoryResponse.dto";
import { BulkProductCodeDto } from "../dtos/productDtos/bulkProductCodes.dto";
import { BulkUnusableProductDto } from "../dtos/productDtos/bulkUnusableProducts.dto";
import { BulkRetireProductDto } from "../dtos/productDtos/bulkRetireProducts.dto";


import { AppError } from "../utils/errorHandlerUtils/appError";
import { validateProduct, validateDepartment, validateUser, validateBulkPreviewProduct } from "../utils/validationsUtils/validations.util";
import { mapToDtoResponse } from "../utils/dtoUtils/mapToDtoResponse.util";
import { invalidProductCodeMsg } from "../utils/messagesUtils/messages.util";
import { shouldBeChecked } from "../utils/productUtils/productCheck.util";
import { prepareMaintenanceHistoryForDto, prepareMovementHistoryForDto, prepareProductForDto, prepareProductForShortDto } from "../utils/dtoUtils/prepareDto.util";
import { handleReviewReason } from "../utils/productUtils/handleReviewedProduct.util";

import { AppDataSource } from "../db/dataSource";
import { BulkRepairProductDto } from "../dtos/productDtos/bulkRepairProducts.dto";
import { ProductShortResponseDto } from "../dtos/productDtos/productShortResponse.dto";
import { BulkActionType } from "../enums/bulkActions.enums";


export class ProductService {

    // repositorios partícipes como atributos
    private productRepository: ProductRepository;
    private departmentRepository: DepartmentRepository;
    private userRepository: UserRepository;
    private retirementHistoryRepository: RetirementHistoryRepository;
    private movementHistoryRepository: MovementHistoryRepository;
    private maintenanceHistoryRepository: MaintenanceHistoryRepository;

    // inicializacion del service
    constructor(productRepo: ProductRepository, deptRepo: DepartmentRepository, userRepo: UserRepository, retirementHistoryRepo: RetirementHistoryRepository, movementHistoryRepo: MovementHistoryRepository, maintenanceHistoryRepo: MaintenanceHistoryRepository) {
        this.productRepository = productRepo;
        this.departmentRepository = deptRepo;
        this.userRepository = userRepo;
        this.retirementHistoryRepository = retirementHistoryRepo;
        this.movementHistoryRepository = movementHistoryRepo;
        this.maintenanceHistoryRepository = maintenanceHistoryRepo;
    }

    // POST: Crear producto
    async createProduct(userId: number, dto: CreateProductDto): Promise<ProductResponseDto> {

        // VALIDACIONES ------------

        // Verificación de departamento
        const departmentCode = dto.departmentCode;
        const department = await validateDepartment(this.departmentRepository, departmentCode);

        // Verificación de usuario

        const user = await validateUser(this.userRepository, userId);

        // VALIDACION DEL CODIGO DE PRODUCTO
        const productCode = dto.productCode;

        const existingProduct = await this.productRepository.verifyProduct(productCode);

        if (existingProduct) {
            throw new AppError(`Ya existe un producto registrado con el código ${productCode}.`, 409);
        }

        //CREACION DE LA ENTIDAD DE NEGOCIO --------
        const newProduct = new Product({
            name: dto.name,
            description: dto.description,
            productCode: dto.productCode,
            category: dto.category,
            physicalCondition: dto.physicalCondition,

            observation: dto.observation,
            isLegacy: dto.isLegacy,
            registrationDate: dto.registrationDate,
            isPendingReview: dto.isPendingReview ?? false,
            pendingReviewReason: dto.isPendingReview ? dto.pendingReviewReason ?? null : null,

            department: department,
            user: user
        });

        // CREACIÓN DEL PRODUCTO -------------
        const savedProduct = await this.productRepository.createProduct(newProduct);

        // se construye un objeto plano
        const productForDto = prepareProductForDto(savedProduct)

        // RESPUESTA (DTO) -------------
        const productCreated = mapToDtoResponse(ProductResponseDto, productForDto);

        return productCreated;
    }

    // GET: obtener todos los productos
    async findAllProducts(page: number, limit: number): Promise<{
        data: ProductShortResponseDto[],
        meta: {
            totalItems: number,
            itemCount: number,
            itemsPerPage: number,
            totalPages: number,
            currentPage: number
        }
    }> {

        // buscar productos y el total de encontrados
        const [products, total] = await this.productRepository.searchProducts(page, limit);

        const foundProducts = products.map(product => {
            const needsCheckReview = shouldBeChecked(product.lastCheckDate);
            const productForDto = prepareProductForShortDto(product);

            const responseDto = mapToDtoResponse(ProductShortResponseDto, productForDto);
            responseDto.needsCheckReview = needsCheckReview;

            return responseDto;
        });

        // calculo de cuantas paginas hay en total
        const lastPage = Math.ceil(total / limit);

        return {
            data: foundProducts,
            meta: {
                totalItems: total,
                itemCount: foundProducts.length,
                itemsPerPage: limit,
                totalPages: lastPage,
                currentPage: page
            }
        };
    }

    // GET: obtener un producto por su código
    async findOneProductByCode(productCode: number): Promise<ProductResponseDto> {

        // busqueda del producto por su codigo
        const product = await this.productRepository.searchProductByCode(productCode)

        //validación sobre la existencia del producto
        if (!product) {
            throw new AppError(invalidProductCodeMsg(productCode), 404);
        }

        // se valida si el producto debe ser revisado fisicamente o no (establecido cada x meses)
        const needsCheckReview = shouldBeChecked(product.lastCheckDate)

        const productForDto = prepareProductForDto(product);

        // se registran los datos del producto encontrado en el DTO de respuesta
        const foundProduct = mapToDtoResponse(ProductResponseDto, productForDto)

        // se añade la validacion antes de enviar el DTO        
        foundProduct.needsCheckReview = needsCheckReview;

        return foundProduct;
    }

    // PATCH: actualizar datos básicos del producto
    async updateProduct(productCode: number, dto: UpdateProductDto): Promise<ProductResponseDto> {

        // VALIDACIONES

        const currentProduct = await validateProduct(this.productRepository, productCode, {
            mustBeActive: true,
            mustNotBeRetired: true,
        })

        // validar codigo de producto duplicado
        if (dto.productCode && dto.productCode !== currentProduct.productCode) {
            const codeExists = await this.productRepository.verifyProduct(dto.productCode);

            if (codeExists) {
                throw new AppError("El nuevo código indicado ya está en uso", 409)
            };
        }

        // CREACION PRODUCTO POR ACTUALIZAR
        Object.assign(currentProduct, {
            ...dto
        })

        // ACTUALIZACIÓN DEL PRODUCTO
        await this.productRepository.updateProduct(currentProduct);

        const productForDto = prepareProductForDto(currentProduct);

        return mapToDtoResponse(ProductResponseDto, productForDto);
    }

    // PATCH: dar de baja un producto (soft delete)
    async retireProduct(productCode: number, userId: number, dto: RetireProductDto): Promise<ProductResponseDto> {

        // VALIDACIONES

        // validaciones de usuario

        const operatorUser = await validateUser(this.userRepository, userId);

        return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {

            // validaciones de producto
            const currentProduct = await validateProduct(this.productRepository, productCode, {
                mustBeActive: false,
                mustNotBeRetired: true,
                transactionalEntityManager
            })

            // si el producto fue dado de baja luego de una revisión hecha previamente, se avisará de ello en el motivo final.
            const unusableReason = dto.unusableReason;

            const finalReason = handleReviewReason(currentProduct, unusableReason);

            // CREACION DE LA ENTRADA DEL PRODUCTO RETIRADO AL HISTORIAL DE BAJAS

            const historyEntry = new RetirementHistory({
                documentReference: dto.documentReference,
                retirementReason: finalReason,
                transactionDate: dto.retirementDate,

                product: currentProduct,
                user: operatorUser
            }
            )

            await this.retirementHistoryRepository.createRetirementHistoryEntry(historyEntry, transactionalEntityManager);

            // CREACION DEL PRODUCTO DADO DE BAJA
            Object.assign(currentProduct, {
                isActive: false,
                isRetired: true,
                retirementDate: dto.retirementDate,
                unusableReason: finalReason,

                isPendingReview: false,
                pendingReviewReason: null,
                dateUnusable: null
            })

            // ACTUALIZACION DEL PRODUCTO
            await this.productRepository.updateProduct(currentProduct, transactionalEntityManager);


            const productForDto = prepareProductForDto(currentProduct);

            return mapToDtoResponse(ProductResponseDto, productForDto);
        });

    }

    // PATCH: reactivar un producto dado de baja (en caso de error)
    async reactivateProduct(productCode: number): Promise<ProductResponseDto> {
        // VALIDACIONES

        const currentProduct = await validateProduct(this.productRepository, productCode, {
            mustBeRetired: true,
        });

        // CREACION DEL PRODUCTO DADO DE BAJA
        Object.assign(currentProduct, {
            isActive: true,
            isRetired: false,
            retirementDate: null,
            unusableReason: null,
        })

        // ACTUALIZACION DEL PRODUCTO
        await this.productRepository.updateProduct(currentProduct);

        const productForDto = prepareProductForDto(currentProduct);

        return mapToDtoResponse(ProductResponseDto, productForDto);
    }

    // PATCH: marcar un producto para revisar
    async sendProductToReview(productCode: number, dto: ReviewProductDto): Promise<ProductResponseDto> {

        // VALIDACIONES

        const currentProduct = await validateProduct(this.productRepository, productCode, {
            mustBeActive: true,
            mustNotBeRetired: true
        });

        if (currentProduct.isPendingReview) {
            throw new AppError(`El producto ${productCode} ya se encuentra en estado de revisión.`, 409);
        }

        // CREACION DEL PRODUCTO PENDIENTE DE REVISION
        Object.assign(currentProduct, {
            isPendingReview: true,
            pendingReviewReason: dto.pendingReviewReason,
        })

        // ACTUALIZACIÓN DEL PRODUCTO
        await this.productRepository.updateProduct(currentProduct);

        const productForDto = prepareProductForDto(currentProduct);

        return mapToDtoResponse(ProductResponseDto, productForDto);
    }

    // PATCH: marcar producto como revisado
    async approveProduct(productCode: number): Promise<ProductResponseDto> {

        // VALIDACIONES
        const currentProduct = await validateProduct(this.productRepository, productCode, {
            mustBeActive: false,
            mustNotBeRetired: true,
        });


        if (!currentProduct.isPendingReview) {
            throw new AppError(`El producto ${productCode} no se encuentra en estado de revisión.`, 409);
        }

        // CREACION DEL PRODUCTO APROBADO
        Object.assign(currentProduct, {
            isPendingReview: false,
            pendingReviewReason: null,
        })

        // ACTUALIZACIÓN DEL PRODUCTO
        await this.productRepository.updateProduct(currentProduct);

        const productForDto = prepareProductForDto(currentProduct);

        return mapToDtoResponse(ProductResponseDto, productForDto);

    }

    // PATCH: establecer un producto como averiado/fuera de uso de forma temporal 
    async markProductAsUnusable(productCode: number, dto: UnusableProductDto): Promise<ProductResponseDto> {

        // VALIDACIONES
        const currentProduct = await validateProduct(this.productRepository, productCode, {
            mustBeActive: false,
            mustNotBeRetired: true,
        });

        if (currentProduct.dateUnusable) {
            throw new AppError(`El producto ${productCode} ya fue reportado como averiado o fuera de uso.`, 409);
        }

        // si el producto fue marcado como averiado/fuera de uso de forma temporal a partir de una revisión hecha previamente, se avisará de ello en el motivo final.
        const unusableReason = dto.unusableReason

        const finalReason = handleReviewReason(currentProduct, unusableReason);

        // CREACION DEL PRODUCTO AVERIADO/FUERA DE USO
        Object.assign(currentProduct, {
            isActive: false,
            dateUnusable: new Date(),
            unusableReason: finalReason,
            physicalCondition: dto.physicalCondition,

            isPendingReview: false,
            pendingReviewReason: null,
        })

        // ACTUALIZACIÓN DEL PRODUCTO
        await this.productRepository.updateProduct(currentProduct);

        const productForDto = prepareProductForDto(currentProduct)

        return mapToDtoResponse(ProductResponseDto, productForDto);
    }

    // PATCH: marcar producto como reparado y apto de uso 
    async repairProduct(productCode: number, userId: number, dto: RepairProductDto): Promise<ProductResponseDto> {

        // VALIDACIONES

        // validaciones de usuario
        const operatorUser = await validateUser(this.userRepository, userId);

        // TRANSACCION
        return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {

            // validaciones de producto
            const currentProduct = await validateProduct(this.productRepository, productCode, {
                mustBeActive: false,
                mustNotBeRetired: true,
                transactionalEntityManager
            });

            if (!currentProduct.unusableReason) {
                throw new AppError(`El producto ${productCode} no se encuentra averiado o ya ha sido reparado.`, 409);
            }

            // CREACION DE LA ENTRADA DEL PRODUCTO AL SU HISTORIAL DE MANTENIMIENTO
            const historyEntry = new MaintenanceHistory({
                repairDate: dto.repairDate,
                unusableDate: currentProduct.dateUnusable,
                breakdownReason: currentProduct.unusableReason,
                repairDescription: dto.repairDescription,
                cost: dto.cost,

                product: currentProduct,
                operator: operatorUser
            });

            await this.maintenanceHistoryRepository.createMaintenanceHistoryEntry(historyEntry, transactionalEntityManager);

            // CREACION DEL PRODUCTO POR REPARAR
            Object.assign(currentProduct, {
                physicalCondition: dto.physicalCondition,
                isActive: true,
                dateUnusable: null,
                unusableReason: null
            });

            // ACTUALIZACION DEL PRODUCTO
            await this.productRepository.updateProduct(currentProduct, transactionalEntityManager);

            const productForDto = prepareProductForDto(currentProduct);

            return mapToDtoResponse(ProductResponseDto, productForDto);
        });
    }

    // PATCH: desplazar un producto a otro lugar para su uso (cambio de departamento)
    async transferProduct(productCode: number, userId: number, dto: TransferProductDto): Promise<ProductResponseDto> {

        // VALIDACIONES

        // validaciones de usuario

        const operatorUser = await validateUser(this.userRepository, userId);

        // validaciones del departamento por transferir
        const targetDepartment = await this.departmentRepository.verifyDepartment(dto.destinationDepartmentCode)

        if (!targetDepartment) {
            throw new AppError('El departamento destino indicado no existe.', 404)
        }

        if (!targetDepartment.isActive) {
            throw new AppError('El departamento destino no está disponible de uso.', 409)
        }


        // TRANSACCION

        return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {

            // validaciones de producto
            const currentProduct = await validateProduct(this.productRepository, productCode, {
                mustBeActive: true,
                mustNotBeRetired: true,
                transactionalEntityManager
            });

            const currentDepartmentCode = currentProduct.department.departmentCode;

            if (targetDepartment.departmentCode === currentDepartmentCode) {
                throw new AppError('El producto ya se encuentra en el departamento indicado.', 409)
            }

            const historyEntry = new MovementHistory({
                user: operatorUser,
                product: currentProduct,
                transferDate: dto.transferDate,
                reasonForMovement: dto.reasonForMovement,
                originDepartment: currentProduct.department,
                destinationDepartment: targetDepartment
            });

            await this.movementHistoryRepository.createMovementHistoryEntry(historyEntry, transactionalEntityManager);

            currentProduct.department = targetDepartment;

            await this.productRepository.saveProduct(currentProduct, transactionalEntityManager);

            const productForDto = prepareProductForDto(currentProduct);

            return mapToDtoResponse(ProductResponseDto, productForDto);
        });
    }

    // PATCH: verificar la existencia fisica de un producto
    async checkProduct(productCode: number): Promise<ProductResponseDto> {

        // VALIDACIONES
        // validaciones de producto
        const currentProduct = await validateProduct(this.productRepository, productCode, {
            mustBeActive: false,
            mustNotBeRetired: true,
        });

        // CREACION DEL PRODUCTO YA VERIFICADO
        Object.assign(currentProduct, {
            lastCheckDate: new Date(),
        })

        // ACTUALIZACION DEL PRODUCTO
        await this.productRepository.updateProduct(currentProduct);
        
        const needsCheckReview = shouldBeChecked(currentProduct.lastCheckDate);
        const productForDto = prepareProductForDto(currentProduct);
        
        const checkedProduct =  mapToDtoResponse(ProductResponseDto, productForDto);
        checkedProduct.needsCheckReview = needsCheckReview;

        return checkedProduct;
    }

    // DELETE: borrar producto de la base de datos
    async deleteProduct(productCode: number): Promise<void> {
        const currentProduct = await validateProduct(this.productRepository, productCode, {
            mustBeActive: false,
            mustNotBeRetired: false,
        });

        const isDeleted = await this.productRepository.deleteProduct(currentProduct.id);

        if (!isDeleted) {
            throw new AppError('El producto no pudo ser eliminado.', 409);
        }

    }

    // GET: obtener productos de un departamento especifico (paginado)
    async findProductsByDepartment(page: number, limit: number, departmentCode: string): Promise<{
        data: ProductShortResponseDto[],
        meta: {
            totalItems: number,
            itemCount: number,
            itemsPerPage: number,
            totalPages: number,
            currentPage: number
        }
    }> {

        const department = await validateDepartment(this.departmentRepository, departmentCode);

        if (!department.isActive) {
            throw new AppError("El departamento indicado no está activo.", 409);
        }

        // busca todos los productos existentes en la base de datos y el total obtenido
        const [products, total] = await this.productRepository.searchProductsByDepartment(page, limit, department);

        // se valida cada producto encontrado si debe ser revisado fisicamente o no (establecido cada x meses)
        const foundProducts = products.map(product => {
            const needsCheckReview = shouldBeChecked(product.lastCheckDate);
            const productForDto = prepareProductForShortDto(product);

            const responseDto = mapToDtoResponse(ProductShortResponseDto, productForDto);
            responseDto.needsCheckReview = needsCheckReview;

            return responseDto;
        });

        // paginas en total
        const lastPage = Math.ceil(total / limit);

        return {
            data: foundProducts,
            meta: {
                totalItems: total,
                itemCount: foundProducts.length,
                itemsPerPage: limit,
                totalPages: lastPage,
                currentPage: page
            }
        };
    }

    // GET: obtener el historial de movimientos de un producto
    async findProductMovementHistory(page: number, limit: number, productCode: number): Promise<{
        data: MovementHistoryResponseDto[],
        meta: {
            totalItems: number,
            itemCount: number,
            itemsPerPage: number,
            totalPages: number,
            currentPage: number
        }
    }> {

        //VALIDACIONES
        const currentProduct = await validateProduct(this.productRepository, productCode, {
            mustBeActive: false,
            mustNotBeRetired: false,
        });

        const productId = currentProduct.id;

        const [history, total] = await this.movementHistoryRepository.findProductMovementHistory(page, limit, productId)

        const productHistory = history.map(entry => {
            const entryForDto = prepareMovementHistoryForDto(entry)
            return mapToDtoResponse(MovementHistoryResponseDto, entryForDto);
        });

        const lastPage = Math.ceil(total / limit);

        return {
            data: productHistory,
            meta: {
                totalItems: total,
                itemCount: productHistory.length,
                itemsPerPage: limit,
                totalPages: lastPage,
                currentPage: page
            }
        };
    }

    // GET: obtener el historial de mantenimiento de un producto
    async findProductMaintenanceHistory(page: number, limit: number, productCode: number): Promise<{
        data: MaintenanceHistoryResponseDto[],
        meta: {
            totalItems: number,
            itemCount: number,
            itemsPerPage: number,
            totalPages: number,
            currentPage: number
        }
    }> {

        //VALIDACIONES
        const currentProduct = await validateProduct(this.productRepository, productCode, {
            mustBeActive: false,
            mustNotBeRetired: false,
        });

        const productId = currentProduct.id;

        const [history, total] = await this.maintenanceHistoryRepository.findProductMaintenanceHistory(page, limit, productId)

        const productHistory = history.map(entry => {
            const historyForDto = prepareMaintenanceHistoryForDto(entry)
            return mapToDtoResponse(MaintenanceHistoryResponseDto, historyForDto);
        });

        const lastPage = Math.ceil(total / limit);

        return {
            data: productHistory,
            meta: {
                totalItems: total,
                itemCount: productHistory.length,
                itemsPerPage: limit,
                totalPages: lastPage,
                currentPage: page
            }
        };
    }

    // BULK ENDPOINTS

    // PATCH: obtener productos antes de su modificacion simultanea (bulk preview)
    async getBulkProductsPreview(dto: BulkProductCodeDto, action: BulkActionType): Promise<{
        data: ProductShortResponseDto[];
        errors: { productCode: number; reason: string }[];
        canProceed: boolean;
    }> {

        const validProducts: ProductShortResponseDto[] = [];
        const invalidProducts: { productCode: number; reason: string }[] = [];

        // los codigos enviados se guardan en un conjunto para evitar duplicados
        const uniqueProductCodes = [...new Set(dto.productCodes)];

        // si no se envió nada, se manda la respuesta vacía
        if (!uniqueProductCodes.length) {
            return {
                data: [],
                errors: [],
                canProceed: false
            };
        }

        // obtener todos los productos
        const products = await this.productRepository.listProductsByCode(uniqueProductCodes);

        // creación de índice de los productos para su busqueda y validacion
        const productMap = new Map(
            products.map(p => [p.productCode, p])
        );

        for (const productCode of uniqueProductCodes) {
            try {

                const product = productMap.get(productCode);

                if (!product) {
                    throw new Error(
                        invalidProductCodeMsg(productCode)
                    );
                }

                //  validaciones dependiendo del tipo de bulk endpoint que se pretende hacer
                validateBulkPreviewProduct(action, product);

                // preparacion DTO
                const needsCheckReview =
                    shouldBeChecked(product.lastCheckDate);

                const productForDto =
                    prepareProductForShortDto(product);

                const responseDto =
                    mapToDtoResponse(
                        ProductShortResponseDto,
                        productForDto
                    );

                responseDto.needsCheckReview = needsCheckReview;

                validProducts.push(responseDto);

            } catch (error: unknown) {
                invalidProducts.push({
                    productCode,
                    reason:
                        error instanceof Error
                            ? error.message
                            : "Error desconocido en la validación."
                });
            }
        }

        // por un lado, se envian los productos validados y, por otro, los que no son aptos de hacer la accion del bulk 
        // (se procede solo con los que sí son aptos y se da aviso de los que no)
        return {
            data: validProducts,
            errors: invalidProducts,
            canProceed: validProducts.length > 0
        };
    }

    // PATCH: transferir mas de un producto a la vez a un departamento
    async bulkTransferProduct(userId: number, dto: BulkTransferProductDto): Promise<void> {

        // TRANSACCION
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {

            // VALIDACIONES
            // validaciones de usuario
            const operatorUser = await validateUser(this.userRepository, userId);

            // validaciones del departamento por transferir
            const targetDepartment = await this.departmentRepository.verifyDepartment(dto.destinationDepartmentCode)

            if (!targetDepartment) {
                throw new AppError('El departamento destino indicado no existe.', 404)
            }

            if (!targetDepartment.isActive) {
                throw new AppError('El departamento destino no está disponible de uso.', 409)
            }

            for (const productCode of dto.productCodes) {

                // validaciones de producto
                const currentProduct = await validateProduct(this.productRepository, productCode, {
                    mustBeActive: true,
                    mustNotBeRetired: true,
                    transactionalEntityManager
                });

                const currentDepartmentCode = currentProduct.department.departmentCode;

                if (targetDepartment.departmentCode === currentDepartmentCode) {
                    throw new AppError(`Uno de los productos ya se encuentra en el departamento al que se quiere transferir: ${currentProduct.name} (COD: ${currentProduct.productCode}).`, 409)
                }

                // CREACION DE LA ENTRADA DEL PRODUCTO POR TRANSFERIR AL HISTORIAL DE MOVIMIENTOS

                const historyEntry = new MovementHistory({
                    user: operatorUser,
                    product: currentProduct,
                    transferDate: dto.transferDate,
                    reasonForMovement: dto.reasonForMovement,
                    originDepartment: currentProduct.department,
                    destinationDepartment: targetDepartment
                })

                await this.movementHistoryRepository.createMovementHistoryEntry(historyEntry, transactionalEntityManager);

                // MODIFICACION DEL PRODUCTO
                currentProduct.department = targetDepartment;

                // ACTUALIZACION DEL PRODUCTO
                await this.productRepository.saveProduct(currentProduct, transactionalEntityManager);
            }

        })
    }
    
    // PATCH: verificar la existencia fisica de mas de un producto a la vez
    async bulkCheckProduct(dto: BulkProductCodeDto): Promise<void> {

        return await AppDataSource.manager.transaction(async (transactionalEntityManager) => {

            // fecha en la que se establece la verificacion fisica (mismo momento al actualizar en el sistema)
            const newCheckDate = new Date();

            for (const productCode of dto.productCodes) {
                // VALIDACIONES
                // validaciones de producto

                const currentProduct = await validateProduct(this.productRepository, productCode, {
                    mustBeActive: false,
                    mustNotBeRetired: true,
                    transactionalEntityManager
                });

                // actualizacion de fecha de revision fisica 
                currentProduct.lastCheckDate = newCheckDate;

                // actualizacion del producto
                await this.productRepository.saveProduct(currentProduct, transactionalEntityManager);
            }
        });
    }


    // PATCH: establecer mas de un producto como averiado/fuera de uso de forma temporal 
    async bulkMarkProductAsUnusable(dto: BulkUnusableProductDto): Promise<void> {

        //TRANSACCION
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {

            const unusableDate = new Date()

            for (const productCode of dto.productCodes) {
                // VALIDACIONES
                const currentProduct = await validateProduct(this.productRepository, productCode, {
                    mustBeActive: false,
                    mustNotBeRetired: true,
                    transactionalEntityManager
                });

                if (currentProduct.dateUnusable) {
                    throw new AppError(`El producto ${productCode} ya fue reportado como averiado o fuera de uso.`, 409);
                }

                // si el producto fue marcado como averiado/fuera de uso de forma temporal a partir de una revisión hecha previamente, se avisará de ello en el motivo final.
                const unusableReason = dto.unusableReason

                const finalReason = handleReviewReason(currentProduct, unusableReason);

                // CREACION DEL PRODUCTO AVERIADO/FUERA DE USO
                Object.assign(currentProduct, {
                    isActive: false,
                    dateUnusable: unusableDate,
                    unusableReason: finalReason,
                    physicalCondition: dto.physicalCondition,

                    isPendingReview: false,
                    pendingReviewReason: null,
                })

                // ACTUALIZACIÓN DEL PRODUCTO
                await this.productRepository.updateProduct(currentProduct, transactionalEntityManager);
            }
        });
    }

    // PATCH: marcar mas de un producto como reparado y apto de uso
    async bulkRepairProduct(dto: BulkRepairProductDto, userId: number) {

        // VALIDACIONES

        // validaciones de usuario
        const operatorUser = await validateUser(this.userRepository, userId);

        // costo por unidad (el costo de reparacion que registra el cliente es el total)
        const unitCost = dto.cost ? (dto.cost / dto.productCodes.length) : 0;

        // TRANSACCION
        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {

            for (const productCode of dto.productCodes) {
                // validaciones de producto
                const currentProduct = await validateProduct(this.productRepository, productCode, {
                    mustBeActive: false,
                    mustNotBeRetired: true,
                    transactionalEntityManager
                });

                if (!currentProduct.unusableReason) {
                    throw new AppError(`El producto ${currentProduct.name} (COD: ${currentProduct.productCode}) no se encuentra averiado o ya ha sido reparado.`, 409);
                }

                // CREACION DE LA ENTRADA DEL PRODUCTO A SU HISTORIAL DE MANTENIMIENTO
                const historyEntry = new MaintenanceHistory({
                    repairDate: dto.repairDate,
                    unusableDate: currentProduct.dateUnusable,
                    breakdownReason: currentProduct.unusableReason,
                    repairDescription: dto.repairDescription,
                    cost: unitCost,

                    product: currentProduct,
                    operator: operatorUser
                });

                await this.maintenanceHistoryRepository.createMaintenanceHistoryEntry(historyEntry, transactionalEntityManager);

                // CREACION DEL PRODUCTO POR REPARAR
                Object.assign(currentProduct, {
                    physicalCondition: dto.physicalCondition,
                    isActive: true,
                    dateUnusable: null,
                    unusableReason: null
                })

                // ACTUALIZACION DEL PRODUCTO
                await this.productRepository.updateProduct(currentProduct, transactionalEntityManager);
            }

        });
    }

    // PATCH: dar de baja a mas de un producto a la vez
    async bulkRetireProduct(userId: number, dto: BulkRetireProductDto): Promise<void> {

        // VALIDACIONES
        // validaciones de usuario

        const operatorUser = await validateUser(this.userRepository, userId);

        await AppDataSource.manager.transaction(async (transactionalEntityManager) => {

            for (const productCode of dto.productCodes) {
                // validaciones de producto
                const currentProduct = await validateProduct(this.productRepository, productCode, {
                    mustBeActive: false,
                    mustNotBeRetired: true,
                    transactionalEntityManager
                })

                // si el producto fue dado de baja luego de una revisión hecha previamente, se avisará de ello en el motivo final.
                let unusableReason = dto.unusableReason;

                const finalReason = handleReviewReason(currentProduct, unusableReason);

                // CREACION DE LA ENTRADA DEL PRODUCTO RETIRADO AL HISTORIAL DE BAJAS

                const historyEntry = new RetirementHistory({
                    documentReference: dto.documentReference,
                    retirementReason: finalReason,
                    transactionDate: dto.retirementDate,

                    product: currentProduct,
                    user: operatorUser
                }
                )

                await this.retirementHistoryRepository.createRetirementHistoryEntry(historyEntry, transactionalEntityManager);

                // CREACION DEL PRODUCTO DADO DE BAJA
                Object.assign(currentProduct, {
                    isActive: false,
                    isRetired: true,
                    retirementDate: dto.retirementDate,
                    unusableReason: finalReason,

                    isPendingReview: false,
                    pendingReviewReason: null,
                    dateUnusable: null
                })

                // ACTUALIZACION DEL PRODUCTO
                await this.productRepository.updateProduct(currentProduct, transactionalEntityManager);
            }
        });
    }

    
    

}

