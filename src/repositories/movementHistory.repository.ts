import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../db/dataSource";

import { MovementHistory } from "../entities/MovementHistory";

export class MovementHistoryRepository {

    private repository: Repository<MovementHistory>;

    constructor() {
        this.repository = AppDataSource.getRepository(MovementHistory);
    }

    // crear entrada de historial de mantenimiento
    async createMovementHistoryEntry(maintenanceHistoryEntry: MovementHistory, entityManager?: EntityManager): Promise<MovementHistory> {

        return await this.saveMovementHistoryEntry(maintenanceHistoryEntry, entityManager);
    }

    // guardar entrada de historial de mantenimiento a la base de datos
    async saveMovementHistoryEntry(newMovementHistoryEntry: MovementHistory, entityManager?: EntityManager): Promise<MovementHistory> {

        const repository = entityManager ? entityManager.getRepository(MovementHistory) : this.repository;

        return await repository.save(newMovementHistoryEntry);
    }

    // obtener el historial de movimientos un producto
    async findProductMovementHistory(page: number, limit: number, productId: number): Promise<[MovementHistory[], number]> {

        const skip = (page - 1) * limit;

        const historyProduct = await this.repository.findAndCount({
            where: { product: { id: productId } },
            relations: ['originDepartment', 'destinationDepartment', 'user'],
            take: limit,
            skip: skip,
            order: { createdAt: 'DESC' }
        });

        return historyProduct;
    }
}