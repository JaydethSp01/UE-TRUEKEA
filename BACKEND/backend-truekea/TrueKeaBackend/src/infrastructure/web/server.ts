import express, { Request, Response, NextFunction } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "../web/routes/authRoutes";
import itemRoutes from "../web/routes/itemRoutes";
import messageRoutes from "../web/routes/messageRoutes";
import ratingRoutes from "../web/routes/ratingRoutes";
import swapRoutes from "../web/routes/swapRoutes";
import userRoutes from "../web/routes/userRoutes";
import user_preferencesRoutes from "../web/routes/user_preferences";
import categoryRoutes from "../web/routes/category";
import roleRoutes from "../web/routes/roleRoutes";
import swapAdminRoutes from "../web/routes/swapAdminRoutes";

import { authMiddleware } from "../web/middlewares/authMiddleware";
import { errorMiddleware } from "../web/middlewares/errorMiddleware";

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas públicas
app.use("/auth", authRoutes);

// Rutas protegidas
app.use("/items", itemRoutes);
app.use("/messages", authMiddleware, messageRoutes);
app.use("/ratings", authMiddleware, ratingRoutes);
app.use("/swaps", authMiddleware, swapRoutes);
app.use("/user/preferences", authMiddleware, user_preferencesRoutes);
app.use("/categories", authMiddleware, categoryRoutes);
app.use("/users", authMiddleware, userRoutes);
app.use("/roles", authMiddleware, roleRoutes);
app.use("/admin/swaps", authMiddleware, swapAdminRoutes);

app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Endpoint not found" });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  errorMiddleware(err, req, res, next);
});

export default app;
