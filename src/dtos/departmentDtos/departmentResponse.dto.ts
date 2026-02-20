import { Exclude, Expose} from 'class-transformer';

@Exclude() 
export class DepartmentResponseDto {

    @Expose()
    departmentCode!: string;
    
    @Expose()
    name!: string;

    @Expose()
    responsibleName!: string;

    @Expose()
    isActive!: boolean; 

    @Expose()
    registrationDate!: Date | null;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;

}