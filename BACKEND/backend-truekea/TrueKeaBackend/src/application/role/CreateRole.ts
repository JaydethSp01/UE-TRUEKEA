import { Role } from "../../domain/entities/Role";
import { IRoleRepository } from "../../domain/ports/IRoleRepository";

export class CreateRole {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(roleData: { name: string }): Promise<Role> {
    const existingRole = await this.roleRepository.findByName(roleData.name);
    if (existingRole) {
      throw new Error("Role with this name already exists");
    }
    const role = new Role(0, roleData.name); // ID is auto-generated
    return this.roleRepository.create(role);
  }
} 