import { Request, Response } from "express";
import SendMessage from "../../../application/message/SendMessage";
import ListMessages from "../../../application/message/ListMessages";

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
      const { itemId, userAId, userBId } = req.body;
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
};
