export class AppError extends Error {
    public readonly statusCode: number;
    public readonly status: string;
    public readonly isOperational: boolean;

    constructor(message: string, statusCode: number) {
        
        super(message);

        this.statusCode = statusCode;

        if (statusCode >= 400 && statusCode < 500) {
            this.status = 'fail';   // 400, 404, 401, etc. (error del cliente)
        } else {
            this.status = 'error';  // 500, 502, 503, etc. (error del servidor)
        }

        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}