import { Expose, Transform} from "class-transformer";
import { transformUserToSimpleResponse } from "../../utils/dtoUtils/classTransformers.util";

export class MaintenanceHistoryResponseDto {
    @Expose()
    repairDate!: Date;
    
    @Expose()
    repairDescription!: string;
    
    @Expose()
    unusableDate!: Date;
    
    @Expose()
    breakdownReason!: string;

    @Expose()
    cost!: number;

    @Expose()
    @Transform(transformUserToSimpleResponse)
    user!: { name: string, surname: string };
}