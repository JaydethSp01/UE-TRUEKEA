// domain/ports/ICategoryRepository.ts
import { Category } from "../entities/Category";
export interface ICategoryRepository {
  create(entity: Category): Promise<Category>;
  findById(id: number): Promise<Category | null>;
  findAll(): Promise<Category[]>;
  update(entity: Category): Promise<Category>;
  delete(id: number): Promise<void>;
}
