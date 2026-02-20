import { plainToInstance } from "class-transformer";

export function mapToDtoResponse<T>(dtoResponse: new () => T, data: object): T {
    
    const dtoResponseMapped = plainToInstance(dtoResponse, data, {
        excludeExtraneousValues: true
    });

    return dtoResponseMapped;
}

