import { Request, Response } from "express";
import SendMessage from "../../../application/message/SendMessage";
import ListMessages from "../../../application/message/ListMessages";
import { MessageRepository } from "../../adapter/typeorm/repositories/MessageRepository";

export default {
  async send(req: Request, res: Response) {
    try {
      const dto = req.body;
      const message = await new SendMessage().execute(dto);
      res.status(201).json(message);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async conversation(req: Request, res: Response) {
    try {
      const itemId = req.body?.itemId ?? req.query?.itemId;
      const userAId = req.body?.userAId ?? req.query?.userAId;
      const userBId = req.body?.userBId ?? req.query?.userBId;
      const messages = await new ListMessages().execute(
        Number(itemId),
        Number(userAId),
        Number(userBId)
      );
      res.json(messages);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async listConversations(req: Request, res: Response) {
    try {
      const userId = Number(req.query?.userId ?? req.body?.userId);
      if (!userId) {
        return res.status(400).json({ message: "userId es requerido" });
      }
      const repo = new MessageRepository();
      const conversations = await repo.getConversationsByUserId(userId);
      res.json(conversations);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
};
