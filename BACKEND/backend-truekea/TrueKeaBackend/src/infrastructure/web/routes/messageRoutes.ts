import { Router } from "express";
import MessageController from "../controllers/MessageController";

const router = Router();

router.post("/", MessageController.send);
router.post("/conversation", MessageController.conversation);

export default router;
