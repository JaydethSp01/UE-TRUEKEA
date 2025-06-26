import { Swap, SwapStatus } from "../../../domain/entities/Swap";
import { ISwapRepository } from "../../../domain/ports/ISwapRepository";

export class UpdateSwap {
  constructor(private swapRepository: ISwapRepository) {}

  async execute(id: number, swapData: { status: SwapStatus }): Promise<Swap | null> {
    const swap = await this.swapRepository.findById(id);
    if (!swap) {
      throw new Error("Swap not found");
    }

    // Update only the status for now, can be extended
    swap.status = swapData.status;

    return this.swapRepository.update(swap);
  }
} 