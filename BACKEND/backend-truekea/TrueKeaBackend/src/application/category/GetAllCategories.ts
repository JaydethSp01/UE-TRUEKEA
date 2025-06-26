import { ICategoryRepository } from "../../domain/ports/ICategoryRepository";
import { CategoryRepository } from "../../infrastructure/adapter/typeorm/repositories/CategoryRepository";
import { Category } from "../../domain/entities/Category";

export default class GetAllCategories {
  private repo: ICategoryRepository = new CategoryRepository();

  async execute(): Promise<Category[]> {
    return await this.repo.findAll();
  }
}
