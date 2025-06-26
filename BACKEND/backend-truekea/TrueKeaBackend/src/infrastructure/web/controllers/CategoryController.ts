import { Request, Response } from "express";
import CreateCategory from "../../../application/category/CreateCategory";
import GetAllCategories from "../../../application/category/GetAllCategories";
import GetCategoryById from "../../../application/category/GetCategoryById";
import UpdateCategory from "../../../application/category/UpdateCategory";
import DeleteCategory from "../../../application/category/DeleteCategory";
import { Category } from "../../../domain/entities/Category";

export default {
  async create(req: Request, res: Response) {
    try {
      const result = await new CreateCategory().execute(req.body);
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  async getAll(req: Request, res: Response) {
    try {
      const result = await new GetAllCategories().execute();
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  async getById(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const result = await new GetCategoryById().execute(id);
      if (!result)
        return res.status(404).json({ message: "Category not found" });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      const updated = new Category(id, req.body.name, req.body.co2);
      const result = await new UpdateCategory().execute(updated);
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },

  async delete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      await new DeleteCategory().execute(id);
      res.status(204).send();
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  },
};
