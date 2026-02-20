import { Exclude, Expose} from 'class-transformer';
import { ProductCategory, ProductCondition } from "../../enums/product.enums";

@Exclude() 
export class ProductShortResponseDto {
    
    @Expose()
    name!: string;

    @Expose()
    productCode!: number;

    @Expose()
    category!: ProductCategory;

    @Expose()
    physicalCondition!: ProductCondition;

    @Expose()
    isLegacy!: boolean;

    @Expose()
    isActive!: boolean;

    @Expose()
    isPendingReview!: boolean | null;

    @Expose()
    needsCheckReview!: boolean;

    @Expose()
    isRetired!: boolean | null
    
    // se transforma la entidad a un objeto simple
    @Expose()
    department!: { departmentCode: string, name: string };
}