import { UserRepository } from "../../repositories/user.repository";
import { ProductRepository } from "../../repositories/product.repository";
import { DepartmentRepository } from "../../repositories/department.repository";
import { AppError } from "../errorHandlerUtils/appError";
import { invalidUserMsg, invalidProductCodeMsg, invalidDepartmentCodeMsg } from "../messagesUtils/messages.util";
import { Product } from "../../entities/Product";
import { EntityManager } from "typeorm";
import { BulkActionType } from "../../enums/bulkActions.enums";


export async function validateProduct(productRepo: ProductRepository, productCode: number, options?: {
    mustBeActive?: boolean,
    // el producto debe estar retirado para que se ejecute la operacion 
    mustBeRetired?: boolean,
    // el producto no debe estar retirado para que se ejecute la operacion
    mustNotBeRetired?: boolean,
    transactionalEntityManager?: EntityManager
}
): Promise<Product> {

    const product = await productRepo.verifyProduct(productCode, options?.transactionalEntityManager);

    if (!product) {
        throw new AppError(invalidProductCodeMsg(productCode), 404);
    }

    if (options?.mustNotBeRetired && product.isRetired) {
        throw new AppError(`El producto ${product.name} (COD: ${product.productCode}) está dado de baja.`, 409);
    }

    if (options?.mustBeRetired && !product.isRetired) {
        throw new AppError("El producto no está dado de baja, no necesita reactivación.", 409);
    }

    if (options?.mustBeActive && !product.isActive) {
        throw new AppError(`El producto ${product.name} (COD: ${product.productCode}) no está activo para utilizar.`, 409);
    }

    return product;
}

export async function validateUser(userRepo: UserRepository, userId: number) {
    const user = await userRepo.verifyUser(userId);

    if (!user) {
        throw new AppError(invalidUserMsg(), 404);
    }

    return user;
}

export async function validateDepartment(deptRepo: DepartmentRepository, departmentCode: string) {
    const department = await deptRepo.verifyDepartment(departmentCode);

    if (!department) {
        throw new AppError(invalidDepartmentCodeMsg(departmentCode), 404);
    }

    return department;
}

export function validateBulkPreviewProduct(action: BulkActionType, product: Product): Product {

    // validacion global
    if (product.isRetired) {
        throw new AppError(
            `El producto ${product.name} (COD: ${product.productCode}) ya está retirado y no puede ser procesado.`,
            400
        );
    }

    // VALIDACIONES SEGÚN ACCIÓN
    switch (action) {
        case BulkActionType.RETIRE:
            break;

        case BulkActionType.UNUSABLE:
            if (product.dateUnusable || !product.isActive) {
                throw new AppError(`El producto ${product.name} (${product.productCode}) ya se encuentra fuera de uso.`, 409);
            }

            break;

        case BulkActionType.REPAIR:

            if (product.isActive || !product.unusableReason) {
                throw new AppError(`El producto ${product.name} (COD: ${product.productCode}) no requiere reparación.`, 409);
            }

            break;

        case BulkActionType.TRANSFER:
             if (!product.isActive) {
                throw new AppError(`El producto ${product.name} (${product.productCode}) debe estar activo para transferirlo.`, 409);
            }
          break;

        case BulkActionType.CHECK:
            break;
    }

    return product;
}

export function validateBulkActionType(bulkAction: string) {

    let bulkActionType: BulkActionType;

    switch (bulkAction) {
        case "retire":
            bulkActionType = BulkActionType.RETIRE;
            break;

        case "unusable":
            bulkActionType = BulkActionType.UNUSABLE;
            break;

        case "repair":
            bulkActionType = BulkActionType.REPAIR;
            break;

        case "check":
            bulkActionType = BulkActionType.CHECK;
            break;

        case "transfer":
            bulkActionType = BulkActionType.TRANSFER;
            break;

        default:
            throw new AppError('Tipo de bulk endpoint inválido.', 404);
    }

    return bulkActionType;
}

