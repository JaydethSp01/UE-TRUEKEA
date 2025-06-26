import { Router, Request, Response, NextFunction } from "express";
import UserController, {
  AuthenticatedRequest,
} from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  UserController.register(req, res).catch(next);
});

router.get(
  "/stats",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    UserController.listStats(req, res).catch(next);
  }
);

router.put(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await UserController.update(req as AuthenticatedRequest, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
