// src/infrastructure/web/controllers/SwapAdminController.ts
import { Request, Response } from "express";
import { SwapRepository } from "../../adapter/typeorm/repositories/SwapRepository";
import { GetAllSwaps } from "../../../application/swap/admin/GetAllSwaps";
import { GetSwapById } from "../../../application/swap/admin/GetSwapById";
import { UpdateSwap } from "../../../application/swap/admin/UpdateSwap";
import { DeleteSwap } from "../../../application/swap/admin/DeleteSwap";

export const SwapAdminController = {
  async getSwaps(req: Request, res: Response) {
    try {
      const swapRepository = new SwapRepository();
      const getSwaps = new GetAllSwaps(swapRepository);
      const swaps = await getSwaps.execute();
      res.status(200).json(swaps);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async getSwapById(req: Request, res: Response) {
    try {
      const swapRepository = new SwapRepository();
      const getSwap = new GetSwapById(swapRepository);
      const swap = await getSwap.execute(parseInt(req.params.id));
      if (swap) {
        res.status(200).json(swap);
      } else {
        res.status(404).json({ message: "Swap not found" });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  },

  async updateSwap(req: Request, res: Response) {
    try {
      const swapRepository = new SwapRepository();
      const updateSwap = new UpdateSwap(swapRepository);
      const swap = await updateSwap.execute(parseInt(req.params.id), req.body);
      res.status(200).json(swap);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },

  async deleteSwap(req: Request, res: Response) {
    try {
      const swapRepository = new SwapRepository();
      const deleteSwap = new DeleteSwap(swapRepository);
      const success = await deleteSwap.execute(parseInt(req.params.id));
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Swap not found" });
      }
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  },
}; 