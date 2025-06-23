// application/swap/RespondSwap.ts
import { ISwapRepository } from "../../domain/ports/ISwapRepository";
import SwapDTO from "../../domain/dtos/SwapDTO";
import { Swap } from "../../domain/entities/Swap";
import { SwapRepository } from "../../infrastructure/adapter/typeorm/repositories/SwapRepository";

export default class RespondSwap {
  private repo: ISwapRepository;

  constructor() {
    this.repo = new SwapRepository();
  }

  async execute(data: {
    id: string;
    requesterId: number;
    respondentId: number;
    requestedItemId: number;
    offeredItemId: number;
    status?: string;
  }): Promise<Swap> {
    try {
      const dto = new SwapDTO(
        Number(data.id),
        data.requesterId,
        data.respondentId,
        data.requestedItemId,
        data.offeredItemId,
        data.status
      );

      const existing = await this.repo.findById(dto.id);
      if (!existing) {
        throw new Error("Swap not found");
      }

      const updated = new Swap(
        existing.id,
        existing.requesterId,
        existing.respondentId,
        existing.requestedItemId,
        existing.offeredItemId,
        dto.status,
        existing.createdAt,
        new Date()
      );

      return await this.repo.update(updated);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
