import { Router } from "express";
import { SwapAdminController } from "../controllers/SwapAdminController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// These routes are for admin purposes and should be protected.
router.use(authMiddleware);

router.get("/", SwapAdminController.getSwaps);
router.get("/:id", SwapAdminController.getSwapById);
router.put("/:id", SwapAdminController.updateSwap);
router.delete("/:id", SwapAdminController.deleteSwap);

export default router; 