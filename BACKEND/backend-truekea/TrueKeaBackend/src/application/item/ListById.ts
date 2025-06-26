// src/application/item/GetItemById.ts
import { IItemRepository } from "../../domain/ports/IItemRepository";
import { ItemRepository } from "../../infrastructure/adapter/typeorm/repositories/ItemRepository";
import { Item } from "../../domain/entities/Item";

export default class GetItemById {
  private repo: IItemRepository;

  constructor() {
    this.repo = new ItemRepository();
  }

  async execute(id: number): Promise<Item | null> {
    return this.repo.findById(id);
  }
}
