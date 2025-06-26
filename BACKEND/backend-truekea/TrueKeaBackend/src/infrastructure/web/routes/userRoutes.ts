import { Router, Request, Response, NextFunction } from "express";
import UserController, {
  AuthenticatedRequest,
} from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import NotificationsController from "../controllers/NotificationsController";

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

router.patch(
  "/:id/deactivate",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await UserController.deactivateUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:userId/notifications",
  authMiddleware,
  (req, res, next) => {
    NotificationsController.getUserNotifications(req, res).catch(next);
  }
);

export default router;
