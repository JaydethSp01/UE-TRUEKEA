// application/item/ListItems.ts
import { IItemRepository } from "../../domain/ports/IItemRepository";
import {
  ItemRepository,
  ItemFilters,
} from "../../infrastructure/adapter/typeorm/repositories/ItemRepository";
import { Item } from "../../domain/entities/Item";

export interface ListItemsFilters extends ItemFilters {}

export default class ListItems {
  private repo: IItemRepository;

  constructor() {
    this.repo = new ItemRepository();
  }

  async execute(filters: ListItemsFilters): Promise<Item[]> {
    return this.repo.findAll(filters);
  }
}
