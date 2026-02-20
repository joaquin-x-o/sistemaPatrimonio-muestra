import { ITokenPayload } from "../../interfaces/auth.interface";

// extiende el namespace global de Express
declare global {
  namespace Express {
    interface Request {
      // se agrega la propiedad para identificar al usuario que usa el sistema a partir de su cookie
      user?: ITokenPayload; 
    }
  }
}

export {};