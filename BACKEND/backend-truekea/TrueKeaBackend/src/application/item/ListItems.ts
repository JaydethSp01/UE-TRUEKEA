// application/item/ListItems.ts
import { IItemRepository } from "../../domain/ports/IItemRepository";
import { ItemRepository } from "../../infrastructure/adapter/typeorm/repositories/ItemRepository";

export default class ListItems {
  private repo: IItemRepository;
  constructor() {
    this.repo = new ItemRepository();
  }
  async execute(id?: string): Promise<any> {
    try {
      if (id) return await this.repo.findById(Number(id));
      return await this.repo.findAll();
    } catch (err) {
      throw new Error("Error listing items");
    }
  }
}
