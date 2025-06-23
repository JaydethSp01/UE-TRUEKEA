// domain/ports/IItemRepository.ts
import { Item } from "../entities/Item";
export interface IItemRepository {
  create(entity: Item): Promise<Item>;
  findById(id: number): Promise<Item | null>;
  findAll(): Promise<Item[]>;
  update(entity: Item): Promise<Item>;
  delete(id: number): Promise<void>;
}
