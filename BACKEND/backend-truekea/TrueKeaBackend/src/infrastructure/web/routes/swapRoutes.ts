// infrastructure/web/routes/swapRoutes.ts
import { Router } from "express";
import SwapController from "../controllers/SwapController";

const router = Router();

router.post("/request", (req, res, next) => {
  SwapController.request(req, res).catch(next);
});

router.post("/respond", (req, res, next) => {
  SwapController.respond(req, res).catch(next);
});

router.post("/complete", (req, res, next) => {
  SwapController.complete(req, res).catch(next);
});

export default router;
