// application/item/UpdateItem.ts
import { IItemRepository } from "../../domain/ports/IItemRepository";
import ItemDTO from "../../domain/dtos/ItemDTO";
import { Item } from "../../domain/entities/Item";
import { ItemRepository } from "../../infrastructure/adapter/typeorm/repositories/ItemRepository";

export default class UpdateItem {
  private repo: IItemRepository;
  constructor() {
    this.repo = new ItemRepository();
  }
  async execute(data: {
    id: string;
    title: string;
    description: string;
    value: number;
    categoryId: number;
    ownerId: number;
  }): Promise<Item> {
    try {
      const dto = new ItemDTO(
        data.title,
        data.description,
        data.value,
        data.categoryId,
        data.ownerId
      );
      const entity = new Item(
        Number(data.id),
        dto.title,
        dto.description,
        dto.value,
        dto.categoryId,
        dto.ownerId
      );
      return await this.repo.update(entity);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
