import { Expose } from 'class-transformer';
import { UserRole } from '../../enums/user.enums';

export class UserResponseDto {

    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    surname!: string;

    @Expose()
    username!: string;

    @Expose()
    isActive!: boolean;

    @Expose()
    role?: UserRole;
}
