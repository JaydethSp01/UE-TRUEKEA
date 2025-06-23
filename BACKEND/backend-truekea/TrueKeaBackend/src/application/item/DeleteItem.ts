// application/item/DeleteItem.ts
import { IItemRepository } from "../../domain/ports/IItemRepository";
import { ItemRepository } from "../../infrastructure/adapter/typeorm/repositories/ItemRepository";

export default class DeleteItem {
  private repo: IItemRepository;
  constructor() {
    this.repo = new ItemRepository();
  }
  async execute(id: string): Promise<void> {
    try {
      await this.repo.delete(Number(id));
    } catch (err) {
      throw new Error("Error deleting item");
    }
  }
}
