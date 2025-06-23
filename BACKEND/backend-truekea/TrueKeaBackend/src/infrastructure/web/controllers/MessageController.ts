// infrastructure/web/controllers/MessageController.ts
import { Request, Response } from "express";
import SendMessage from "../../../application/message/SendMessage";

export default {
  async send(req: Request, res: Response) {
    try {
      const dto = req.body;
      const message = await new SendMessage().execute(dto);
      return res.status(201).json(message);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
};
