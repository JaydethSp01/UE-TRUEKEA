import { Request, Response } from "express";
import { SwapRepository } from "../../adapter/typeorm/repositories/SwapRepository";
import { MessageRepository } from "../../adapter/typeorm/repositories/MessageRepository";

const NotificationsController = {
  async getUserNotifications(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (!userId) {
        return res.status(400).json({ message: "userId requerido" });
      }

      const swapRepo = new SwapRepository();
      const allSwaps = await swapRepo.findAll();
      const userSwaps = allSwaps.filter(
        (swap) => swap.requesterId === userId || swap.respondentId === userId
      );

      const messageRepo = new MessageRepository();
      const userMessages = await messageRepo.getAllByReceiverId(userId);

      return res.json({
        swaps: userSwaps,
        messages: userMessages,
      });
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  },
};

export default NotificationsController; 