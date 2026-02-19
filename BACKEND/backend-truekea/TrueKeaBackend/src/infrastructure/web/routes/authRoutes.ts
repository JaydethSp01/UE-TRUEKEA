// authRoutes.ts
import { Router } from "express";
import AuthController from "../controllers/AuthController";
import UserController from "../controllers/UserController";

const router = Router();

router.post("/login", (req, res, next) => {
  AuthController.authenticate(req, res).catch(next);
});

router.post("/refresh", (req, res, next) => {
  AuthController.refresh(req, res).catch(next);
});

// Registro público (sin auth)
router.post("/register", (req, res, next) => {
  UserController.register(req, res).catch(next);
});

export default router;
