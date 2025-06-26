import { Router } from "express";
import CategoryController from "../controllers/CategoryController";

const router = Router();

router.post("/", (req, res, next) => {
  CategoryController.create(req, res).catch(next);
});

router.get("/", (req, res, next) => {
  CategoryController.getAll(req, res).catch(next);
});

router.get("/:id", (req, res, next) => {
  CategoryController.getById(req, res).catch(next);
});

router.put("/:id", (req, res, next) => {
  CategoryController.update(req, res).catch(next);
});

router.delete("/:id", (req, res, next) => {
  CategoryController.delete(req, res).catch(next);
});

export default router;
