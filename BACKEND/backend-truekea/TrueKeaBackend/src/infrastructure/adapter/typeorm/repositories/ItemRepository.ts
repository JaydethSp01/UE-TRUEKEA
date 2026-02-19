// infrastructure/adapter/typeorm/repositories/ItemRepository.ts
import { ItemEntity } from "../entities/ItemEntity";
import { IItemRepository } from "../../../../domain/ports/IItemRepository";
import { Item } from "../../../../domain/entities/Item";
import { getRepository, In, MoreThanOrEqual, LessThanOrEqual } from "typeorm";
import CarbonFootprintHelper from "../../../web/utils/CarbonFootprintHelper";

export interface ItemFilters {
  categoryIds?: number[];
  minCo2?: number;
  maxCo2?: number;
  nameRegex?: string;
  ownerId?: number;
}

export class ItemRepository implements IItemRepository {
  private repo = getRepository(ItemEntity);

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

      // Construyo la entidad de dominio como antes
      const item = new Item(
        found.id,
        found.title,
        found.description,
        Number(found.value),
        found.category.id,
        found.owner.id,
        found.img_item
      );

      // Luego asigno las entidades completas
      Object.assign(item, {
        category: found.category,
        owner: found.owner,
      });

      return item;
    } catch {
      return null;
    }
  }

  async findAll(filters: ItemFilters = {}): Promise<Item[]> {
    const qb = this.repo
      .createQueryBuilder("item")
      .leftJoinAndSelect("item.category", "category")
      .leftJoinAndSelect("item.owner", "owner")
      .leftJoin("item.requestedSwaps", "rs")
      .leftJoin("rs.ratings", "rr")
      .leftJoin("item.offeredSwaps", "os")
      .leftJoin("os.ratings", "or")
      // compute the average of all swap ratings, whether on requested or offered swaps
      .addSelect(
        `AVG(
           COALESCE(rr.score, 0) + COALESCE(or.score, 0)
         ) / NULLIF(
           (COUNT(rr.id) + COUNT(or.id)),
           0
         )`,
        "avgRating"
      )
      .groupBy("item.id")
      .addGroupBy("category.id")
      .addGroupBy("owner.id");

    if (filters.categoryIds?.length) {
      qb.andWhere("category.id IN (:...categoryIds)", {
        categoryIds: filters.categoryIds,
      });
    }
    if (filters.minCo2 !== undefined) {
      qb.andWhere("category.co2 >= :minCo2", { minCo2: filters.minCo2 });
    }
    if (filters.maxCo2 !== undefined) {
      qb.andWhere("category.co2 <= :maxCo2", { maxCo2: filters.maxCo2 });
    }
    if (filters.nameRegex) {
      qb.andWhere("item.title ~* :regex", { regex: filters.nameRegex });
    }
    if (filters.ownerId !== undefined) {
      qb.andWhere("owner.id = :ownerId", { ownerId: filters.ownerId });
    }

    // get both raw and entity results
    const { entities, raw } = await qb.getRawAndEntities();

    return entities.map((e, i) => {
      const row = raw[i] as { avgRating: string | null };

      const co2Unit = CarbonFootprintHelper.getProductCO2(e.category.name) || 0;
      const co2Total = co2Unit;
      const co2Equivalencies =
        CarbonFootprintHelper.calculateEquivalencies(co2Total);

      // Nos aseguramos de que los arrays existan
      const requestedSwaps = e.requestedSwaps ?? [];
      const offeredSwaps = e.offeredSwaps ?? [];
      const allSwaps = [...requestedSwaps, ...offeredSwaps];

      let status: "available" | "pending" | "exchanged" = "available";
      if (allSwaps.some((s) => s.status === "pending")) status = "pending";
      else if (allSwaps.some((s) => s.status === "completed"))
        status = "exchanged";

      const item = new Item(
        e.id,
        e.title,
        e.description,
        Number(e.value),
        e.category.id,
        e.owner.id,
        e.img_item
      );

      Object.assign(item, {
        category: e.category,
        owner: e.owner,
        co2Unit,
        co2Total,
        co2Equivalencies,
        status,
        rating:
          row.avgRating !== null
            ? Math.round(parseFloat(row.avgRating) * 10) / 10
            : 0,
      });

      return item;
    });
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

  async findByCategoryIds(ids: number[]): Promise<Item[]> {
    const entities = await this.repo
      .createQueryBuilder("i")
      .leftJoinAndSelect("i.category", "category")
      .leftJoinAndSelect("i.owner", "owner")
      .where("i.categoryId IN (:...ids)", { ids })
      .getMany();

    return entities.map(
      (e) =>
        new Item(
          e.id,
          e.title,
          e.description,
          Number(e.value),
          e.category.id,
          e.owner.id,
          e.img_item
        )
    );
  }
}
