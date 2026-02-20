import { Request, Response } from 'express';

import { CreateDepartmentDto } from "../dtos/departmentDtos/createDepartment.dto";
import { DepartmentService } from "../services/department.service";
import { validateDto } from "../utils/dtoUtils/validateDto.util";
import { UpdateDepartmentDto } from '../dtos/departmentDtos/updateDepartment.dto';

export class DepartmentController {
    private departmentService: DepartmentService;

    // inicializacion del controller
    constructor(service: DepartmentService) {
        this.departmentService = service;
    }

    // POST: crear un nuevo departamento
    async createDepartment(req: Request, res: Response) {

        const body = req.body;

        const dto = await validateDto(CreateDepartmentDto, body)

        const newDepartment = await this.departmentService.createDepartment(dto);
        return res.status(201).json({ message: 'Departamento creado correctamente.', data: newDepartment });

    }

    // GET: obtener todos los departamentos
    async getDepartments(req: Request, res: Response) {

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Number(req.query.limit) || 10);

        const departments = await this.departmentService.findAllDepartments(page, limit);
        return res.status(201).json({departments});

    }

    // GET: obtener un departmento por su codigo
    async getDepartmentByCode(req: Request, res: Response) {

        const { departmentCode } = req.params;

        const department = await this.departmentService.findOneDepartmentByCode(departmentCode);

        return res.status(201).json({ message: 'Departamento encontrado.', data: department });

    }

    // PATCH: actualizar datos basicos de un departamento
    async updateDepartment(req: Request, res: Response) {

        const { departmentCode } = req.params;
        const body = req.body;

        const dto = await validateDto(UpdateDepartmentDto, body);

        const updatedDepartment = await this.departmentService.updateDepartment(departmentCode, dto);

        return res.status(201).json({ message: 'Departamento actualizado.', data: updatedDepartment });


    }

    // PATCH: deshabilitar un departamento
    async disableDepartment(req: Request, res: Response) {

        const { departmentCode } = req.params;

        const disabledDepartment = await this.departmentService.disableDepartment(departmentCode);
        return res.status(200).json({ message: 'Departamento deshabilitado.', data: disabledDepartment });

    }

    // PATCH: habilitar un departamento
    async enableDepartment(req: Request, res: Response) {

        const { departmentCode } = req.params;

        const enabledDepartment = await this.departmentService.enableDepartment(departmentCode);

        return res.status(200).json({ message: 'Departamento habilitado.', data: enabledDepartment });

    }

    // DELETE: borrar un departamento
    async deleteDepartment(req: Request, res: Response) {

        const { departmentCode } = req.params;
        await this.departmentService.deleteDepartment(departmentCode)

        return res.status(200).json({ message: 'Departamento eliminado.' });

    }
}