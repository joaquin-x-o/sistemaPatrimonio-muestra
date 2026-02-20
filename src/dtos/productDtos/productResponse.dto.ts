import { Exclude, Expose} from 'class-transformer';
import { ProductCategory, ProductCondition } from "../../enums/product.enums";

@Exclude() 
export class ProductResponseDto {
    
    @Expose()
    name!: string;

    @Expose()
    description!: string;

    @Expose()
    observation!: string;

    @Expose()
    productCode!: number;

    @Expose()
    category!: ProductCategory;

    @Expose()
    physicalCondition!: ProductCondition;

    @Expose()
    isActive!: boolean;

    @Expose()
    isLegacy!: boolean;

    @Expose()
    registrationDate!: Date | null;

    @Expose()
    isPendingReview!: boolean | null;

    @Expose()
    pendingReviewReason!: string | null;

    @Expose()
    lastCheckDate!: Date | null;

    @Expose()
    needsCheckReview!: boolean;

    @Expose()
    dateUnusable!: Date | null;

    @Expose()
    unusableReason!: string | null;

    @Expose()
    isRetired!: boolean | null

    @Expose()
    retirementDate!: Date | null;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;

    
    // se transforma la entidad a un objeto simple
    @Expose()
    department!: { departmentCode: string, name: string };

    @Expose()
    user!: { name: string, surname: string };
}