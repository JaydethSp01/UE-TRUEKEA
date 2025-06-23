// infrastructure/web/controllers/RatingController.ts
import { Request, Response } from "express";
import RateSwap from "../../../application/rating/RateSwap";

export default {
  async rate(req: Request, res: Response) {
    try {
      const dto = req.body;
      const rating = await new RateSwap().execute(dto);
      return res.status(201).json(rating);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
};
