// infrastructure/web/routes/itemRoutes.ts
import { Router } from "express";
import ItemController from "../controllers/ItemController";
import multer from "multer";

const router = Router();
const upload = multer();

router.post("/", upload.single("image"), (req, res, next) => {
  ItemController.create(req, res).catch(next);
});

router.post("/list", (req, res, next) => {
  ItemController.list(req, res).catch(next);
});

router.get("/:id", (req, res, next) => {
  ItemController.get(req, res).catch(next);
});

router.put("/:id", (req, res, next) => {
  ItemController.update(req, res).catch(next);
});

router.delete("/:id", (req, res, next) => {
  ItemController.delete(req, res).catch(next);
});

export default router;
