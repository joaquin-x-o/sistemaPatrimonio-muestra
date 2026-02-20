import { RetirementHistoryResponseDto } from "../dtos/historyDtos/retirementHistoryResponse.dto";
import { RetirementHistoryRepository } from "../repositories/retirementHistory.repository";
import { mapToDtoResponse } from "../utils/dtoUtils/mapToDtoResponse.util";
import { prepareRetirementHistoryForDto } from "../utils/dtoUtils/prepareDto.util";

export class RetirementHistoryService {
    private retirementHistoryRepository: RetirementHistoryRepository;

    constructor(retirementHistoryRepo: RetirementHistoryRepository) {
        this.retirementHistoryRepository = retirementHistoryRepo;
    }

    // GET: obtener historial de entradas
    async findAllRetirementHistoryEntries(page: number, limit: number): Promise<{data: RetirementHistoryResponseDto[], meta: object}> {

        // busqueda de todas las entradas del historial
        const [entries, total] = await this.retirementHistoryRepository.searchRetirementHistoryEntries(page, limit);

        // conversion de los resultados a partir de un DTO de respuesta
        const foundEntries = entries.map(entry => {
            const historyForDto = prepareRetirementHistoryForDto(entry);
            return mapToDtoResponse(RetirementHistoryResponseDto, historyForDto);
        });

        const lastPage = Math.ceil(total/limit)

         return {
            data: foundEntries,
            meta: {
                totalItems: total,
                itemCount: foundEntries.length,
                itemsPerPage: limit,
                totalPages: lastPage,
                currentPage: page
            }
        };
    }
}