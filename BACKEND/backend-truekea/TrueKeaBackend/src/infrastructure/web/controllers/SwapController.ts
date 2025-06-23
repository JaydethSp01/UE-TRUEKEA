// infrastructure/web/controllers/SwapController.ts
import { Request, Response } from "express";
import RequestSwap from "../../../application/swap/RequestSwap";
import RespondSwap from "../../../application/swap/RespondSwap";
import CompleteSwap from "../../../application/swap/CompleteSwap";

export default {
  async request(req: Request, res: Response) {
    try {
      const dto = req.body;
      const swap = await new RequestSwap().execute(dto);
      return res.status(201).json(swap);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
  async respond(req: Request, res: Response) {
    try {
      const dto = req.body;
      const swap = await new RespondSwap().execute(dto);
      return res.json(swap);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
  async complete(req: Request, res: Response) {
    try {
      const dto = req.body;
      const result = await new CompleteSwap().execute(dto);
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
};
