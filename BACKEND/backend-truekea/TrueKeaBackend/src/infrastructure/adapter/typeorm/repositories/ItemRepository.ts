// infrastructure/adapter/typeorm/repositories/ItemRepository.ts
import { getRepository, Repository } from "typeorm";
import { ItemEntity } from "../entities/ItemEntity";
import { IItemRepository } from "../../../../domain/ports/IItemRepository";
import { Item } from "../../../../domain/entities/Item";

export class ItemRepository implements IItemRepository {
  private repo: Repository<ItemEntity>;

  constructor() {
    this.repo = getRepository(ItemEntity);
  }

  async create(item: Item): Promise<Item> {
    try {
      const entity = this.repo.create({
        title: item.title,
        description: item.description,
        value: item.value,
        category: { id: item.categoryId },
        owner: { id: item.ownerId },
        img_item: item.img_item,
      });

      const saved = await this.repo.save(entity);

      return new Item(
        saved.id,
        saved.title,
        saved.description,
        saved.value,
        saved.category.id,
        saved.owner.id,
        saved.img_item
      );
    } catch (error: any) {
      console.error("❌ Error creating item:", error);
      throw new Error("Error creating item");
    }
  }

  async findById(id: number): Promise<Item | null> {
    try {
      const found = await this.repo.findOne({
        where: { id },
        relations: ["category", "owner"],
      });

      if (!found) return null;

      return new Item(
        found.id,
        found.title,
        found.description,
        found.value,
        found.category.id,
        found.owner.id,
        found.img_item
      );
    } catch {
      return null;
    }
  }

  async findAll(): Promise<Item[]> {
    try {
      const entities = await this.repo.find({
        relations: ["category", "owner"],
      });

      return entities.map(
        (e) =>
          new Item(
            e.id,
            e.title,
            e.description,
            e.value,
            e.category.id,
            e.owner.id,
            e.img_item
          )
      );
    } catch {
      return [];
    }
  }

  async update(item: Item): Promise<Item> {
    try {
      const entity = await this.repo.preload({
        id: item.id,
        title: item.title,
        description: item.description,
        value: item.value,
        category: { id: item.categoryId },
        owner: { id: item.ownerId },
        img_item: item.img_item,
      });

      if (!entity) throw new Error("Item not found");

      const updated = await this.repo.save(entity);

      return new Item(
        updated.id,
        updated.title,
        updated.description,
        updated.value,
        updated.category.id,
        updated.owner.id,
        updated.img_item
      );
    } catch {
      throw new Error("Error updating item");
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.repo.delete(id);
    } catch {
      throw new Error("Error deleting item");
    }
  }
}
