import { Expose } from 'class-transformer';
import { UserRole } from '../../enums/user.enums';

export class LoginUserResponseDto {

    @Expose()
    accessToken!: string;

    @Expose()
    refreshToken!: string;

    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    surname!: string;

    @Expose()
    username!: string;

    @Expose()
    role!: UserRole;
}
