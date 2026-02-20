import { EntityManager, Repository } from "typeorm";
import { AppDataSource } from "../db/dataSource";

import { RetirementHistory } from "../entities/RetirementHistory";


export class RetirementHistoryRepository {

    private repository: Repository<RetirementHistory>;

    constructor() {
        this.repository = AppDataSource.getRepository(RetirementHistory);
    }

    // crear entrada de historial de bajas
    async createRetirementHistoryEntry(retirementHistoryEntry: RetirementHistory, entityManager?: EntityManager): Promise<RetirementHistory> {

        return await this.saveRetirementHistoryEntry(retirementHistoryEntry, entityManager);

    }

    // guardar entrada de historial de bajas a la base de datos
    async saveRetirementHistoryEntry(newRetirementHistoryEntry: RetirementHistory, entityManager?: EntityManager): Promise<RetirementHistory> {
        
        const repository = entityManager ? entityManager.getRepository(RetirementHistory): this.repository;

        return await repository.save(newRetirementHistoryEntry);

    }

    // obtener entradas del historial de productos dados de baja
    async searchRetirementHistoryEntries(page: number, limit: number): Promise<[RetirementHistory[], number]> {
        
        const skip = (page - 1) * limit;

        const entries = await this.repository.findAndCount({
            relations: ['product', 'user'],
            take: limit,
            skip: skip,
            order: {transactionDate: 'DESC'}
        });

        return entries;
    }
}