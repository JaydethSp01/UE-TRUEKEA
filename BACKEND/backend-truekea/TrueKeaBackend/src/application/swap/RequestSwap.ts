// application/swap/RequestSwap.ts
import { ISwapRepository } from "../../domain/ports/ISwapRepository";
import SwapDTO from "../../domain/dtos/SwapDTO";
import { Swap } from "../../domain/entities/Swap";
import { SwapRepository } from "../../infrastructure/adapter/typeorm/repositories/SwapRepository";

export default class RequestSwap {
  private repo: ISwapRepository;
  constructor() {
    this.repo = new SwapRepository();
  }
  async execute(dto: SwapDTO): Promise<Swap> {
    try {
      const entity = new Swap(
        0,
        dto.requesterId,
        dto.respondentId,
        dto.requestedItemId,
        dto.offeredItemId,
        "pending",
        new Date(),
        new Date()
      );
      return await this.repo.create(entity);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
