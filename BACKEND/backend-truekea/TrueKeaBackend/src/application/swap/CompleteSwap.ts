// application/swap/CompleteSwap.ts
import { ISwapRepository } from "../../domain/ports/ISwapRepository";
import SwapDTO from "../../domain/dtos/SwapDTO";
import { Swap } from "../../domain/entities/Swap";
import { SwapRepository } from "../../infrastructure/adapter/typeorm/repositories/SwapRepository";

export default class CompleteSwap {
  private repo: ISwapRepository;
  constructor() {
    this.repo = new SwapRepository();
  }
  async execute(dto: SwapDTO): Promise<Swap> {
    try {
      const existing = await this.repo.findById(dto.requestedItemId);
      if (!existing) throw new Error("Swap not found");
      const updated = new Swap(
        existing.id,
        existing.requesterId,
        existing.respondentId,
        existing.requestedItemId,
        existing.offeredItemId,
        "completed",
        existing.createdAt,
        new Date()
      );
      return await this.repo.update(updated);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
