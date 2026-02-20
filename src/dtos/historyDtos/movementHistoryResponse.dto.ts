import { Expose } from "class-transformer";


export class MovementHistoryResponseDto {
    @Expose()
    transferDate!: Date;

    @Expose()
    reasonForMovement!: string;

    @Expose()
    originDepartment!: { departmentCode: string, name: string };

    @Expose()
    destinationDepartment!: { departmentCode: string, name: string };

    @Expose()
    user!: { name: string, surname: string };
}