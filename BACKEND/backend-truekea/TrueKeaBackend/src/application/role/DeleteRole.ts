import { IRoleRepository } from "../../domain/ports/IRoleRepository";

export class DeleteRole {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(id: number): Promise<boolean> {
    const role = await this.roleRepository.findById(id);
    if (!role) {
      throw new Error("Role not found");
    }
    return this.roleRepository.delete(id);
  }
} 