// infrastructure/web/routes/messageRoutes.ts
import { Router } from "express";
import MessageController from "../controllers/MessageController";

const router = Router();

router.post("/", (req, res, next) => {
  MessageController.send(req, res).catch(next);
});

export default router;
