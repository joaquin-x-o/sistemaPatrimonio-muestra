import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const accessKey = process.env.JWT_ACCESS_SECRET;

if (!accessKey) {
    throw new Error("No se ha definido JWT_ACCESS_SECRET en las variables de entorno.");
}

const JWT_ACCESS_SECRET: string = accessKey;

const refreshKey = process.env.JWT_REFRESH_SECRET;

if (!refreshKey) {
    throw new Error("No se ha definido JWT_REFRESH_SECRET en las variables de entorno.");
}

const JWT_REFRESH_SECRET: string = refreshKey;


// generar access token
export function generateAccessToken(payload: object) {
    const token = jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '8h' });

    return token
}

// generar refresh token
export function generateRefreshToken(payload: object) {
    const token = jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '8h' });

    return token
}

// verficar y decodificar access token
export function verifyAccessToken(token: string) {
    const verifiedToken = jwt.verify(token, JWT_ACCESS_SECRET);

    return verifiedToken
}

// verficar y decodificar refresh token
export function verifyRefreshToken(token: string) {
    const verifiedToken = jwt.verify(token, JWT_REFRESH_SECRET);

    return verifiedToken
}