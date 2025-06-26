// src/application/role/UpdateRole.ts
import { Role } from "../../domain/entities/Role";
import { IRoleRepository } from "../../domain/ports/IRoleRepository";

export class UpdateRole {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(id: number, roleData: { name: string }): Promise<Role | null> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error("Role not found");
    }
    // Check if another role with the same name exists
    const existingRole = await this.roleRepository.findByName(roleData.name);
    if (existingRole && existingRole.id !== id) {
      throw new Error("Role name already in use");
    }

    return this.roleRepository.update(id, roleData);
  }
} 