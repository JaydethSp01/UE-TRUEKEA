import { Category } from "../../domain/entities/Category";
import { ICategoryRepository } from "../../domain/ports/ICategoryRepository";
import { CategoryRepository } from "../../infrastructure/adapter/typeorm/repositories/CategoryRepository";

export default class CreateCategory {
  private repo: ICategoryRepository = new CategoryRepository();

  async execute(data: { name: string; co2: number }): Promise<Category> {
    const category = new Category(0, data.name, data.co2);
    return await this.repo.create(category);
  }
}
