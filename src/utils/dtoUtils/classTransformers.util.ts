import { TransformFnParams } from 'class-transformer';

export const trimString = ({ value }: TransformFnParams) => {
    if (typeof value === 'string') {
        return value.trim();
    }
    return value;
};


// transforma una entidad de Departamento a un objeto simple
export const transformDepartmentToSimpleResponse = ({ value }: { value: any }) => {
    if (!value) return null;
    return {
        departmentCode: value.departmentCode,
        name: value.name
    };
};


// transforma una entidad de Usuario a un objeto simple
export const transformUserToSimpleResponse = ({ value }: { value: any }) => {
    if (!value) return null;
    return {
        name: value.name,
        surname: value.surname
    };
};

// transforma una entidad de producto a un objeto simple
export const transformProductToSimpleResponse = ({ value }: { value: any }) => {
    if (!value) return null;
    return {
        productCode: value.productCode,
        name: value.name
    };
};