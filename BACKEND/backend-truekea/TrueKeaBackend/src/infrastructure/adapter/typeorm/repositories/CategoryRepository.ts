// infrastructure/adapter/typeorm/repositories/CategoryRepository.ts
import { getRepository } from "typeorm";
import { CategoryEntity } from "../entities/CategoryEntity";
import { ICategoryRepository } from "../../../../domain/ports/ICategoryRepository";
import { Category } from "../../../../domain/entities/Category";

export class CategoryRepository implements ICategoryRepository {
  private repo = getRepository(CategoryEntity);

  async create(entity: Category): Promise<Category> {
    try {
      const saved = await this.repo.save(entity);
      return saved;
    } catch (err) {
      throw new Error("Error creating category");
    }
  }

  async findById(id: number): Promise<Category | null> {
    try {
      return (await this.repo.findOne({ where: { id } })) || null;
    } catch {
      return null;
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.repo.find();
    } catch {
      return [];
    }
  }

  async update(entity: Category): Promise<Category> {
    try {
      await this.repo.save(entity);
      return entity;
    } catch {
      throw new Error("Error updating category");
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch {
      throw new Error("Error deleting category");
    }
  }
}
