import { Router } from "express";
import MessageController from "../controllers/MessageController";

const router = Router();

router.post("/", MessageController.send);
router.get("/conversation", MessageController.conversation);
router.post("/conversation", MessageController.conversation);
router.get("/conversations", MessageController.listConversations);

export default router;
