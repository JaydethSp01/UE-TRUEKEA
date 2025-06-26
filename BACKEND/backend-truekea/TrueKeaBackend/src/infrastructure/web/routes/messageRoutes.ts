import { Router } from "express";
import MessageController from "../controllers/MessageController";

const router = Router();

router.post("/", MessageController.send);
router.get("/conversation", MessageController.conversation);

export default router;
