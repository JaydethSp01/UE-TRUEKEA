// infrastructure/adapter/typeorm/repositories/RoleRepository.ts
import { getRepository } from "typeorm";
import { RoleEntity } from "../entities/RoleEntity";
import { IRoleRepository } from "../../../../domain/ports/IRoleRepository";
import { Role } from "../../../../domain/entities/Role";

export class RoleRepository implements IRoleRepository {
  private repo = getRepository(RoleEntity);

  async findByName(name: string): Promise<Role | null> {
    try {
      return (await this.repo.findOne({ where: { name } })) || null;
    } catch {
      return null;
    }
  }
}
