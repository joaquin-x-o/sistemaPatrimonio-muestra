export function invalidProductCodeMsg(productCode: number): string {
    const msg = `No existe ningún producto con el código ${productCode}`;

    return msg;
}

export function invalidDepartmentCodeMsg(departmentCode: string): string {
    const msg = `No existe ningún departamento con el código ${departmentCode}`;

    return msg;
}

export function invalidUserMsg(): string {
    const msg = 'No se encontró el usuario';

    return msg;
}