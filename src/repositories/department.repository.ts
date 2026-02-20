import { Repository } from "typeorm";
import { AppDataSource } from "../db/dataSource";

import { Department } from "../entities/Department";

export class DepartmentRepository {

    private repository: Repository<Department>;

    constructor() {
        this.repository = AppDataSource.getRepository(Department);
    }

    // crear departamento
    async createDepartment(department: Department): Promise<Department> {

        return await this.saveDepartment(department);
    }

    // guardar departamento a la base de datos
    async saveDepartment(newDepartment: Department): Promise<Department> {
        return await this.repository.save(newDepartment);
    }

    // buscar departamentos existentes
    async searchDepartments(page: number, limit: number): Promise<[Department[], number]> {
        
        const skip = (page - 1) * limit;

        const [departments, total] = await this.repository.findAndCount({
            take: limit,
            skip: skip,
            order: {createdAt: 'DESC'}
        });

        return [departments, total];
    }

    // buscar un departamento a partir de su codigo
    async searchDepartmentByCode(departmentCode: string): Promise<Department | null> {
        const department = await this.repository.findOne({
            where: { departmentCode: departmentCode },
            relations: ['products', 'movementsOrigin', 'movementsDestination']
        })

        return department;
    }

    // actualizar datos basicos de un departamento
    async updateDepartment(department: Department): Promise<Department | null> {

        // PRELOAD
        const updatedDepartment = await this.repository.preload(department);

        // si no se encuentra el departamento por actualizar mediante su ID, se devuelve null
        if (!updatedDepartment) {
            return null;
        }

        // guardado del departamento actualizado
        return await this.saveDepartment(updatedDepartment);
    }

    // borrar departamento
    async deleteDepartment(id: number): Promise<boolean> {
        try {
            const result = await this.repository.delete(id);
            return result.affected !== 0;
        } catch (error: any) {
            if (error.code === '23503') {
                throw error;
            }
            throw error;
        }
    }

    // verificar existencia del departamento (por ID)
    async verifyDepartment(departmentCode: string): Promise<Department | null> {

        const department = await this.repository.findOneBy({ departmentCode: departmentCode });

        return department;
    }

}
