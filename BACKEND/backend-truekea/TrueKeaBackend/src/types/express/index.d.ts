// types/express/index.d.ts
import { User } from "../../domain/entities/User";

declare global {
  namespace Express {
    interface Request {
      userId: number;
      user?: User;
    }
  }
}

export {};
