// authRoutes.ts
import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();

router.post("/login", (req, res, next) => {
  AuthController.authenticate(req, res).catch(next);
});

router.post("/refresh", (req, res, next) => {
  AuthController.refresh(req, res).catch(next);
});

export default router;
