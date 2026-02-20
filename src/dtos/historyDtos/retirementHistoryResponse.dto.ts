import { Expose, Transform} from "class-transformer";
import { transformProductToSimpleResponse, transformUserToSimpleResponse } from "../../utils/dtoUtils/classTransformers.util";

export class RetirementHistoryResponseDto {
    @Expose()
    documentReference!: string;

    @Expose()
    retirementReason!: string;

    @Expose()
    transactionDate!: Date;

    @Expose()
    @Transform(transformProductToSimpleResponse)
    product!: {productCode: number, name:string}


    @Expose()
    @Transform(transformUserToSimpleResponse)
    user!: { name: string, surname: string };
}