import { Swap } from "../../../domain/entities/Swap";
import { ISwapRepository } from "../../../domain/ports/ISwapRepository";

export class GetAllSwaps {
  constructor(private swapRepository: ISwapRepository) {}

  async execute(): Promise<Swap[]> {
    return this.swapRepository.findAll();
  }
} 