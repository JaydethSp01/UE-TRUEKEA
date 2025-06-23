// infrastructure/web/controllers/ItemController.ts
import { Request, Response } from "express";
import CreateItem from "../../../application/item/CreateItem";
import ListItems from "../../../application/item/ListItems";
import UpdateItem from "../../../application/item/UpdateItem";
import DeleteItem from "../../../application/item/DeleteItem";

export default {
  async create(req: Request, res: Response) {
    try {
      const dto = req.body;
      const item = await new CreateItem().execute(dto);
      return res.status(201).json(item);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
  async list(req: Request, res: Response) {
    try {
      const items = await new ListItems().execute();
      return res.json(items);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
  async get(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const item = await new ListItems().execute(id);
      return res.json(item);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const dto = { id, ...req.body };
      const updated = await new UpdateItem().execute(dto);
      return res.json(updated);
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await new DeleteItem().execute(id);
      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  },
};
