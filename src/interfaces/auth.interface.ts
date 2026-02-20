import { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../enums/user.enums'; // Tu enum de roles


export interface ITokenPayload extends JwtPayload {
    id: number;
    role: UserRole;
    isActive: boolean;
}

