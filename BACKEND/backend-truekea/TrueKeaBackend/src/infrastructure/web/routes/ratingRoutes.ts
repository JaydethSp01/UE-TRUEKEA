// infrastructure/web/routes/ratingRoutes.ts
import { Router } from "express";
import RatingController from "../controllers/RatingController";

const router = Router();

router.post("/", (req, res, next) => {
  RatingController.rate(req, res).catch(next);
});

export default router;
