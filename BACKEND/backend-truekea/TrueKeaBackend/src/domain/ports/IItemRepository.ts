import { ItemFilters } from "../../infrastructure/adapter/typeorm/repositories/ItemRepository";
import { Item } from "../entities/Item";

export interface IItemRepository {
  create(item: Item): Promise<Item>;
  findById(id: number): Promise<Item | null>;
  findAll(filters?: ItemFilters): Promise<Item[]>;
  update(item: Item): Promise<Item>;
  delete(id: number): Promise<void>;
  findByCategoryIds(ids: number[]): Promise<Item[]>;
}
