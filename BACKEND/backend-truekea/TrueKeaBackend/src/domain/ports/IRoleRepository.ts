// domain/ports/IRoleRepository.ts
import { Role } from "../entities/Role";
export interface IRoleRepository {
  findByName(name: string): Promise<Role | null>;
}
