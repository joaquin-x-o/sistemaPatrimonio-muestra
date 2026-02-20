import { Request, Response } from 'express';

import { RetirementHistoryService } from "../services/retirementHistory.service";

export class RetirementHistoryController {
    private retirementHistoryService: RetirementHistoryService;

    constructor(retirementHistoryService: RetirementHistoryService) {
        this.retirementHistoryService = retirementHistoryService;
    }

    // GET: obtener todos los registros del historial de baja
    async getRetirementHistoryEntries(req: Request, res: Response) {

        const page = Math.max(1, Number(req.query.page) || 1);
        const limit = Math.max(1, Number(req.query.limit) || 10);

        const entries = await this.retirementHistoryService.findAllRetirementHistoryEntries(page, limit);
        return res.status(201).json({ data: entries });

    }


}