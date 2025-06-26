import { Swap } from "../../../domain/entities/Swap";
import { ISwapRepository } from "../../../domain/ports/ISwapRepository";

export class GetSwapById {
  constructor(private swapRepository: ISwapRepository) {}

  async execute(id: number): Promise<Swap | null> {
    return this.swapRepository.findById(id);
  }
} 