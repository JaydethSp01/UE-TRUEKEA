// domain/ports/ISwapRepository.ts
import { Swap } from "../entities/Swap";
export interface ISwapRepository {
  create(entity: Swap): Promise<Swap>;
  findById(id: number): Promise<Swap | null>;
  findAll(): Promise<Swap[]>;
  update(entity: Swap): Promise<Swap>;
  delete(id: number): Promise<boolean>;
}
