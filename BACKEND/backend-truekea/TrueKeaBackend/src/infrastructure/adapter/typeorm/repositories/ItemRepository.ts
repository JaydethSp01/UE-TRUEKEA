// infrastructure/adapter/typeorm/repositories/ItemRepository.ts
import { getRepository } from "typeorm";
import { ItemEntity } from "../entities/ItemEntity";
import { IItemRepository } from "../../../../domain/ports/IItemRepository";
import { Item } from "../../../../domain/entities/Item";

export class ItemRepository implements IItemRepository {
  private repo = getRepository(ItemEntity);

  async create(entity: Item): Promise<Item> {
    try {
      return await this.repo.save(entity);
    } catch {
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
        found.owner.id
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
            e.owner.id
          )
      );
    } catch {
      return [];
    }
  }
  async update(entity: Item): Promise<Item> {
    try {
      return await this.repo.save(entity);
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
