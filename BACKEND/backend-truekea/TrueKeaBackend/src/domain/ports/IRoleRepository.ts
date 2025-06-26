// domain/ports/IRoleRepository.ts
import { Role } from "../entities/Role";

export interface IRoleRepository {
  create(role: Partial<Role>): Promise<Role>;
  findById(id: number): Promise<Role | null>;
  findByName(name: string): Promise<Role | null>;
  findAll(): Promise<Role[]>;
  update(id: number, role: Partial<Role>): Promise<Role | null>;
  delete(id: number): Promise<boolean>;
}
