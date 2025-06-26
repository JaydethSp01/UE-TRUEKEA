import { ICategoryRepository } from "../../domain/ports/ICategoryRepository";
import { CategoryRepository } from "../../infrastructure/adapter/typeorm/repositories/CategoryRepository";

export default class DeleteCategory {
  private repo: ICategoryRepository = new CategoryRepository();

  async execute(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
