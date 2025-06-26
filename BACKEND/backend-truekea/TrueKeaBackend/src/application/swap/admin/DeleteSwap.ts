import { ISwapRepository } from "../../../domain/ports/ISwapRepository";

export class DeleteSwap {
  constructor(private swapRepository: ISwapRepository) {}

  async execute(id: number): Promise<boolean> {
    const swap = await this.swapRepository.findById(id);
    if (!swap) {
      throw new Error("Swap not found");
    }
    return this.swapRepository.delete(id);
  }
} 