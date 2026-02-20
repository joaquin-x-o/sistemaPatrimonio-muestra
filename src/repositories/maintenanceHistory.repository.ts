import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../db/dataSource";

import { MaintenanceHistory } from "../entities/MaintenanceHistory";

export class MaintenanceHistoryRepository {

    private repository: Repository<MaintenanceHistory>;

    constructor() {
        this.repository = AppDataSource.getRepository(MaintenanceHistory);
    }

    // crear entrada de historial de mantenimiento
    async createMaintenanceHistoryEntry(maintenanceHistoryEntry: MaintenanceHistory, entityManager?: EntityManager): Promise<MaintenanceHistory> {

        return await this.saveMaintenanceHistoryEntry(maintenanceHistoryEntry, entityManager);

    }

    // guardar entrada de historial de mantenimiento a la base de datos
    async saveMaintenanceHistoryEntry(newMaintenanceHistoryEntry: MaintenanceHistory, entityManager?: EntityManager): Promise<MaintenanceHistory> {

        const repository = entityManager ? entityManager.getRepository(MaintenanceHistory) : this.repository;

        return await repository.save(newMaintenanceHistoryEntry);

    }

    // obtener el historial de mantenimiento un producto
    async findProductMaintenanceHistory(page: number, limit: number, productId: number): Promise<[MaintenanceHistory[], number]> {

        const skip = (page - 1) * limit;

        const historyProduct = await this.repository.findAndCount({
            where: { product: { id: productId } },
            relations: ['operator'],
            take: limit,
            skip: skip,
            order: { createdAt: 'DESC' }
        });

        return historyProduct;
    }


}