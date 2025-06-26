import { Router } from "express";
import UserPreferenceController from "../controllers/UserPreferenceController";

const router = Router();

router.post("/", (req, res, next) => {
  UserPreferenceController.create(req, res).catch(next);
});

router.post("/bulk", (req, res, next) => {
  UserPreferenceController.createMany(req, res).catch(next);
});

router.get("/:userId", (req, res, next) => {
  UserPreferenceController.findByUserId(req, res).catch(next);
});

router.delete("/:userId", (req, res, next) => {
  UserPreferenceController.deleteAll(req, res).catch(next);
});

export default router;
