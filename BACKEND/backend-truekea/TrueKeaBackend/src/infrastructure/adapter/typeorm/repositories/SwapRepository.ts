// infrastructure/adapter/typeorm/repositories/SwapRepository.ts
import { getRepository } from "typeorm";
import { SwapEntity } from "../entities/SwapEntity";
import { ISwapRepository } from "../../../../domain/ports/ISwapRepository";
import { Swap, SwapStatus } from "../../../../domain/entities/Swap";

export class SwapRepository implements ISwapRepository {
  private repo = getRepository(SwapEntity);

  async create(entity: Swap): Promise<Swap> {
    try {
      return await this.repo.save(entity);
    } catch {
      throw new Error("Error creating swap");
    }
  }

  async findById(id: number): Promise<Swap | null> {
    try {
      const found = await this.repo.findOne({ where: { id } });

      if (!found) return null;

      const status = found.status as SwapStatus;

      return new Swap(
        found.id,
        found.requester.id,
        found.respondent.id,
        found.requestedItem.id,
        found.offeredItem.id,
        status,
        found.createdAt,
        found.updatedAt
      );
    } catch {
      return null;
    }
  }
  async update(entity: Swap): Promise<Swap> {
    try {
      return await this.repo.save(entity);
    } catch {
      throw new Error("Error updating swap");
    }
  }
}
