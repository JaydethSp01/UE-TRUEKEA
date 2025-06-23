// types/express/index.d.ts
import { User } from "../../domain/entities/User";
import { File } from "multer"; // Importa el tipo de archivo de Multer

declare global {
  namespace Express {
    interface Request {
      userId: number;
      user?: User;
      file?: File;
    }
  }
}

export {};
