import { Department } from "../entities/Department";

import { DepartmentRepository } from "../repositories/department.repository";
import { ProductRepository } from "../repositories/product.repository";

import { CreateDepartmentDto } from "../dtos/departmentDtos/createDepartment.dto";
import { DepartmentResponseDto } from "../dtos/departmentDtos/departmentResponse.dto";
import { UpdateDepartmentDto } from "../dtos/departmentDtos/updateDepartment.dto";

import { mapToDtoResponse } from "../utils/dtoUtils/mapToDtoResponse.util";
import { invalidDepartmentCodeMsg } from "../utils/messagesUtils/messages.util";
import { AppError } from "../utils/errorHandlerUtils/appError";
import { validateDepartment } from "../utils/validationsUtils/validations.util";


export class DepartmentService {
    private departmentRepository: DepartmentRepository;
    private productRepository: ProductRepository;

    constructor(departmentRepo: DepartmentRepository, productRepo: ProductRepository) {
        this.departmentRepository = departmentRepo;
        this.productRepository = productRepo;;
    }

    // POST: crear departamento
    async createDepartment(dto: CreateDepartmentDto): Promise<DepartmentResponseDto> {
        // VALIDACIONES

        // verificacion de la existencia de un departamento con el mismo codigo
        const departmentCode = dto.departmentCode;
        const existingDepartment = await this.departmentRepository.verifyDepartment(departmentCode)

        if (existingDepartment) {
            throw new AppError(`Ya existe un departamento registrado con el código ${departmentCode}`, 409);
        }

        // CREACION DE LA NUEVA ENTIDAD DEPARTAMENTO
        const departmentToCreate = new Department({
            departmentCode: dto.departmentCode,
            name: dto.name,
            responsibleName: dto.responsibleName
        })

        const departmentCreated = await this.departmentRepository.createDepartment(departmentToCreate);

        if (!departmentCreated) {
            throw new AppError('Se produjo un error al crear el departamento.', 409);
        }

        return mapToDtoResponse(DepartmentResponseDto, departmentCreated);
    }

    // GET: obtener todos los departamentos
    async findAllDepartments(page: number, limit: number): Promise<{ data: DepartmentResponseDto[], meta: object }> {

        // busqueda de todos los departmentos existentes en la base de datos
        const [departments, total] = await this.departmentRepository.searchDepartments(page, limit);

        // conversion de los resultados a partir de un DTO de respuesta
        const foundDepartments = departments.map(department => mapToDtoResponse(DepartmentResponseDto, department));

        // calculo de paginas totales
        const lastPage = Math.ceil(total / limit);

        return {
            data: foundDepartments,
            meta: {
                totalItems: total,
                itemCount: foundDepartments.length,
                itemsPerPage: limit,
                totalPages: lastPage,
                currentPage: page
            }
        };
    }

    // GET: obtener departamento por su codigo
    async findOneDepartmentByCode(departmentCode: string): Promise<DepartmentResponseDto> {

        // busqueda del departmento indicado por su codigo
        const department = await this.departmentRepository.searchDepartmentByCode(departmentCode);

        // validacion sobre la existencia del departamento
        if (!department) {
            throw new AppError(invalidDepartmentCodeMsg(departmentCode), 404)
        }

        return mapToDtoResponse(DepartmentResponseDto, department)
    }

    // PATCH: actualizar datos basicos de un departamento
    async updateDepartment(departmentCode: string, dto: UpdateDepartmentDto): Promise<DepartmentResponseDto> {

        // VALIDACIONES
        const currentDepartment = await validateDepartment(this.departmentRepository, departmentCode);

        // validar codigo de departamento duplicado
        if (dto.departmentCode && dto.departmentCode !== currentDepartment.departmentCode) {
            const codeExists = await this.departmentRepository.verifyDepartment(dto.departmentCode);
            if (codeExists) throw new AppError("El nuevo código indicado ya está en uso", 409);
        }

        // CREACION DEL DEPARTAMENTO POR ACTUALIZAR
        const departmentToUpdate = new Department({
            id: currentDepartment.id,
            ...dto
        })

        // ACTUALIZACION DEL DEPARTAMENTO
        const updatedDepartment = await this.departmentRepository.updateDepartment(departmentToUpdate);

        if (!updatedDepartment) {
            throw new AppError('No es posible realizar la actualización de los datos del departamento indicado.', 409);
        }

        return mapToDtoResponse(DepartmentResponseDto, updatedDepartment)
    }

    // PATCH: deshabilitar un departamento
    async disableDepartment(departmentCode: string): Promise<DepartmentResponseDto> {

        //VALIDACIONES

        // existencia del departamento
        const currentDepartment = await validateDepartment(this.departmentRepository, departmentCode);

        if (!currentDepartment.isActive) {
            throw new AppError(`${currentDepartment.name} (${currentDepartment.departmentCode}) ya se encuentra deshabilitado.`, 409);
        }

        // si hay productos activos en el departamento por deshabilitar, no se podra continuar con el proceso
        const productsInDepartment = await this.productRepository.countProductsByDepartment(currentDepartment);

        if (productsInDepartment > 0) {
            throw new AppError(`No se puede dar de baja el departamento porque aún tiene ${productsInDepartment} productos asignados. Asegúrese de administrar dichos productos primero.`, 403);

        }

        // CREACION DEL DEPARTAMENTO DESHABILITADO

        const departmentToDisable = new Department({
            id: currentDepartment.id,

            isActive: false
        })

        const disabledDepartment = await this.departmentRepository.updateDepartment(departmentToDisable);

        if (!disabledDepartment) {
            throw new AppError('No fue posible deshabilitar el departamento.', 409)
        }

        return mapToDtoResponse(DepartmentResponseDto, disabledDepartment);

    }

    // PATCH: habilitar un departamento
    async enableDepartment(departmentCode: string): Promise<DepartmentResponseDto> {

        //VALIDACIONES

        // existencia del departamento
        const currentDepartment = await validateDepartment(this.departmentRepository, departmentCode);

        // el departamento ya esta habilitado
        if (currentDepartment.isActive) {
            throw new AppError(`${currentDepartment.name} (${currentDepartment.departmentCode}) ya se encuentra habilitado.`, 409);
        }

        // CREACION DEL DEPARTAMENTO HABILITADO

        const departmentToEnable = new Department({
            id: currentDepartment.id,

            isActive: true
        })

        const enabledDepartment = await this.departmentRepository.updateDepartment(departmentToEnable)

        if (!enabledDepartment) {
            throw new AppError('No fue posible habilitar el departamento.', 409)
        }

        return mapToDtoResponse(DepartmentResponseDto, enabledDepartment);

    }

    // DELETE: borrar un departamento
    async deleteDepartment(departmentCode: string): Promise<void> {

        // VALIDACIONES
        const currentDepartment = await validateDepartment(this.departmentRepository, departmentCode);
        
        // si hay productos en el departamento, no se podra continuar con el proceso
        const totalProducts = await this.productRepository.countAllProductsByDepartment(currentDepartment);

        if (totalProducts > 0) {
            throw new AppError(`No se puede eliminar el departamento. Aún tiene ${totalProducts} productos vinculados.`, 403);
        }

        // BORRADO DEL DEPARTAMENTO
        const isDeleted = await this.departmentRepository.deleteDepartment(currentDepartment.id);

        if (!isDeleted) {
            throw new AppError('El departamento no pudo ser borrado.', 409);
        }
    }

}