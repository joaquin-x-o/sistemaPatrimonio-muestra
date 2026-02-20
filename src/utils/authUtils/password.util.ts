import bcrypt from 'bcrypt';

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

// hashear contraseña
export async function hashPassword(password: string): Promise<string> {

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        return hashedPassword;
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise <boolean> {

        const isSamePassword = await bcrypt.compare(plainPassword, hashedPassword);

        return isSamePassword;
}


