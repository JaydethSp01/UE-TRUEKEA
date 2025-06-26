// infrastructure/adapter/typeorm/repositories/RoleRepository.ts
import { getRepository } from "typeorm";
import { RoleEntity } from "../entities/RoleEntity";
import { IRoleRepository } from "../../../../domain/ports/IRoleRepository";
import { Role } from "../../../../domain/entities/Role";

export class RoleRepository implements IRoleRepository {
  private repo = getRepository(RoleEntity);

  async create(roleData: Partial<Role>): Promise<Role> {
    const role = this.repo.create(roleData);
    const savedRole = await this.repo.save(role);
    return new Role(savedRole.id, savedRole.name);
  }

  async findById(id: number): Promise<Role | null> {
    const role = await this.repo.findOne({ where: { id } });
    if (!role) return null;
    return new Role(role.id, role.name);
  }

  async findByName(name: string): Promise<Role | null> {
    try {
      const role = await this.repo.findOne({ where: { name } });
      if (!role) return null;
      return new Role(role.id, role.name);
    } catch {
      return null;
    }
  }

  async findAll(): Promise<Role[]> {
    const roles = await this.repo.find();
    return roles.map((role) => new Role(role.id, role.name));
  }

  async update(id: number, roleData: Partial<Role>): Promise<Role | null> {
    await this.repo.update(id, roleData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repo.delete(id);
    return result.affected !== 0;
  }
}
