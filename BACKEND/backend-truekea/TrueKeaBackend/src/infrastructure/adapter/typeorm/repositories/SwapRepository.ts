// infrastructure/adapter/typeorm/repositories/SwapRepository.ts
import { getRepository } from "typeorm";
import { SwapEntity } from "../entities/SwapEntity";
import { ISwapRepository } from "../../../../domain/ports/ISwapRepository";
import { Swap, SwapStatus } from "../../../../domain/entities/Swap";

export class SwapRepository implements ISwapRepository {
  private repo = getRepository(SwapEntity);

  private toDomain(entity: SwapEntity): Swap {
    return new Swap(
      entity.id,
      entity.requester.id,
      entity.respondent.id,
      entity.requestedItem.id,
      entity.offeredItem.id,
      entity.status as SwapStatus,
      entity.createdAt,
      entity.updatedAt
    );
  }

  async create(entity: Swap): Promise<Swap> {
    try {
      const swapEntity = this.repo.create({
        requester: { id: entity.requesterId },
        respondent: { id: entity.respondentId },
        requestedItem: { id: entity.requestedItemId },
        offeredItem: { id: entity.offeredItemId },
        status: entity.status,
      });
      const saved = await this.repo.save(swapEntity);
      return this.toDomain(await this.repo.findOneOrFail({ where: { id: saved.id }, relations: ["requester", "respondent", "requestedItem", "offeredItem"] }));
    } catch(e) {
      console.log(e);
      throw new Error("Error creating swap");
    }
  }

  async findById(id: number): Promise<Swap | null> {
    try {
      const found = await this.repo.findOne({ where: { id }, relations: ["requester", "respondent", "requestedItem", "offeredItem"] });

      if (!found) return null;

      return this.toDomain(found);
    } catch {
      return null;
    }
  }

  async findAll(): Promise<Swap[]> {
    const swaps = await this.repo.find({ relations: ["requester", "respondent", "requestedItem", "offeredItem"] });
    return swaps.map(this.toDomain);
  }

  async update(entity: Swap): Promise<Swap> {
    try {
      const { id, ...rest } = entity;
      await this.repo.update(id, {
        requester: { id: entity.requesterId },
        respondent: { id: entity.respondentId },
        requestedItem: { id: entity.requestedItemId },
        offeredItem: { id: entity.offeredItemId },
        status: entity.status,
       });
      return this.toDomain(await this.repo.findOneOrFail({ where: { id }, relations: ["requester", "respondent", "requestedItem", "offeredItem"] }));
    } catch {
      throw new Error("Error updating swap");
    }
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
