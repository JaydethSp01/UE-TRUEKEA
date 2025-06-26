import { Role } from "../../domain/entities/Role";
import { IRoleRepository } from "../../domain/ports/IRoleRepository";

export class GetRoleById {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(id: number): Promise<Role | null> {
    return this.roleRepository.findById(id);
  }
} 