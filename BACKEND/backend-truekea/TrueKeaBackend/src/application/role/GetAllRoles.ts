// src/application/role/GetAllRoles.ts
import { Role } from "../../domain/entities/Role";
import { IRoleRepository } from "../../domain/ports/IRoleRepository";

export class GetAllRoles {
  constructor(private roleRepository: IRoleRepository) {}

  async execute(): Promise<Role[]> {
    return this.roleRepository.findAll();
  }
} 