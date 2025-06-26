import { Category } from "../../domain/entities/Category";
import { ICategoryRepository } from "../../domain/ports/ICategoryRepository";
import { CategoryRepository } from "../../infrastructure/adapter/typeorm/repositories/CategoryRepository";

export default class UpdateCategory {
  private repo: ICategoryRepository = new CategoryRepository();

  async execute(category: Category): Promise<Category> {
    return await this.repo.update(category);
  }
}
