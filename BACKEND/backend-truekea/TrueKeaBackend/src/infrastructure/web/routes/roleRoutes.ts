// src/infrastructure/web/routes/roleRoutes.ts
import { Router } from "express";
import { RoleController } from "../controllers/RoleController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// These routes should be protected and only accessible by admins.
router.use(authMiddleware);

router.post("/", RoleController.createRole);
router.get("/", RoleController.getRoles);
router.get("/:id", RoleController.getRoleById);
router.put("/:id", RoleController.updateRole);
router.delete("/:id", RoleController.deleteRole);

export default router; 