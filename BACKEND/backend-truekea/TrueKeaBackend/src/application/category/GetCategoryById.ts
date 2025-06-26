import { ICategoryRepository } from "../../domain/ports/ICategoryRepository";
import { CategoryRepository } from "../../infrastructure/adapter/typeorm/repositories/CategoryRepository";
import { Category } from "../../domain/entities/Category";

export default class GetCategoryById {
  private repo: ICategoryRepository = new CategoryRepository();

  async execute(id: number): Promise<Category | null> {
    return await this.repo.findById(id);
  }
}
