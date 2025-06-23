// src/infrastructure/web/middlewares/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../../config/default";

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: "Token missing" });
      return;
    }

    const [, token] = authHeader.split(" ");
    const payload = jwt.verify(token, config.jwt.secret) as { sub: string };

    (req as any).userId = parseInt(payload.sub, 10);

    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
}
