import { MaintenanceHistory } from "../../entities/MaintenanceHistory";
import { MovementHistory } from "../../entities/MovementHistory";
import { Product } from "../../entities/Product";
import { RetirementHistory } from "../../entities/RetirementHistory";
import { formatLegacyDepartmentCode } from "../formattersUtils/formatLegacyDepartmentCode.util";

export function prepareProductForDto(product: Product): object{
    const productForDto: any = { ...product };

    const formattedDepartmentCode = formatLegacyDepartmentCode(product.isLegacy, product.department.departmentCode)

    // Procesar department
    if (product.department) {
        productForDto.department = {
            departmentCode: formattedDepartmentCode,
            name: product.department.name,
        };
    } else {
        productForDto.department = null;
    }

    // Procesar user
    if (product.user) {
        productForDto.user = {
            name: product.user.name,
            surname: product.user.surname,
        };
    } else {
        productForDto.user = null;
    }

    return productForDto;
}

export function prepareProductForShortDto(product: Product) {
    const productForDto: any = { ...product };

    const formattedDepartmentCode = formatLegacyDepartmentCode(product.isLegacy, product.department.departmentCode)

    // Procesar department
    if (product.department) {
        productForDto.department = {
            departmentCode: formattedDepartmentCode,
            name: product.department.name,
        };
    } else {
        productForDto.department = null;
    }

    return productForDto;
}

export function prepareMovementHistoryForDto(history: MovementHistory) {
    const historyForDto: any = { ...history };

    // Procesar origin department
    if (history.originDepartment) {
        historyForDto.originDepartment= {
            departmentCode: history.originDepartment.departmentCode,
            name: history.originDepartment.name,
        };
    } else {
        historyForDto.department = null;
    }

    // Procesar destination department
    if (history.destinationDepartment) {
        historyForDto.destinationDepartment= {
            departmentCode: history.destinationDepartment.departmentCode,
            name: history.destinationDepartment.name,
        };
    } else {
        historyForDto.department = null;
    }

    // Procesar user
    if (history.user) {
        historyForDto.user = {
            name: history.user.name,
            surname: history.user.surname,
        };
    } else {
        historyForDto.user = null;
    }

    return historyForDto;
}

export function prepareMaintenanceHistoryForDto(history: MaintenanceHistory) {
    const historyForDto: any = { ...history };

    // Procesar user
    if (history.operator) {
        historyForDto.user = {
            name: history.operator.name,
            surname: history.operator.surname,
        };
    } else {
        historyForDto.operator = null;
    }

    return historyForDto;
}

export function prepareRetirementHistoryForDto(history: RetirementHistory) {
    const historyForDto: any = { ...history };

    // procesar producto
    if (history.product) {
        historyForDto.product = {
            productCode: history.product.productCode,
            name: history.product.name
        }
    }


    // Procesar user
    if (history.user) {
        historyForDto.user = {
            name: history.user.name,
            surname: history.user.surname,
        };
    } else {
        historyForDto.operator = null;
    }

    return historyForDto;
}