import { Router, Request, Response, NextFunction } from "express";
import UserController, {
  AuthenticatedRequest,
} from "../controllers/UserController";
import { authMiddleware } from "../middlewares/authMiddleware";
import NotificationsController from "../controllers/NotificationsController";

const router = Router();

router.get(
  "/stats",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    UserController.listStats(req, res).catch(next);
  }
);

router.get(
  "/top",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    UserController.getTopUsers(req, res).catch(next);
  }
);

router.get(
  "/",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    UserController.list(req, res).catch(next);
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

router.patch(
  "/:id/activate",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    UserController.activateUser(req, res).catch(next);
  }
);

router.get(
  "/:userId/stats",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    UserController.getUserStatsByUserId(req, res).catch(next);
  }
);

router.get(
  "/:userId/notifications",
  authMiddleware,
  (req, res, next) => {
    NotificationsController.getUserNotifications(req, res).catch(next);
  }
);

router.delete(
  "/:id",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    UserController.deleteUser(req, res).catch(next);
  }
);

router.get(
  "/:id",
  authMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    UserController.getById(req, res).catch(next);
  }
);

export default router;
