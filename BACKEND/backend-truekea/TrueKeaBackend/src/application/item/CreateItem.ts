// application/item/CreateItem.ts
import { IItemRepository } from "../../domain/ports/IItemRepository";
import ItemDTO from "../../domain/dtos/ItemDTO";
import { Item } from "../../domain/entities/Item";
import { ItemRepository } from "../../infrastructure/adapter/typeorm/repositories/ItemRepository";

export default class CreateItem {
  private repo: IItemRepository;
  constructor() {
    this.repo = new ItemRepository();
  }
  async execute(dto: ItemDTO): Promise<Item> {
    try {
      const entity = new Item(
        0,
        dto.title,
        dto.description,
        dto.value,
        dto.categoryId,
        dto.ownerId
      );
      return await this.repo.create(entity);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
