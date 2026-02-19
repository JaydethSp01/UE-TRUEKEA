import { Router, RequestHandler } from "express";
import MessageController from "../controllers/MessageController";

const router = Router();

router.post("/", MessageController.send as RequestHandler);
router.get("/conversation", MessageController.conversation as RequestHandler);
router.post("/conversation", MessageController.conversation as RequestHandler);
router.get("/conversations", MessageController.listConversations as RequestHandler);

export default router;
