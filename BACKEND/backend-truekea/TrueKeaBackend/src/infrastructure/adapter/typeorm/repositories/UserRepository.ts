// infrastructure/adapter/typeorm/repositories/UserRepository.ts
import { getRepository } from "typeorm";
import { UserEntity } from "../entities/UserEntity";
import { IUserRepository } from "../../../../domain/ports/IUserRepository";
import { User } from "../../../../domain/entities/User";

export class UserRepository implements IUserRepository {
  private repo = getRepository(UserEntity);

  async create(entity: User): Promise<User> {
    const saved = await this.repo.save({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      roleId: { id: entity.roleId },
      status_user: entity.status_user,
    });

    // Reload to get the full entity with relations
    const reloaded = await this.repo.findOne({
      where: { id: saved.id },
      relations: ["roleId"],
    });

    if (!reloaded) throw new Error("Failed to create user");

    return new User(
      reloaded.id,
      reloaded.name,
      reloaded.email,
      reloaded.password,
      reloaded.roleId.id,
      reloaded.createdAt,
      reloaded.updatedAt,
      reloaded.status_user
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.repo.findOne({
      where: { email },
      relations: ["roleId"],
    });
    if (!found) return null;

    return new User(
      found.id,
      found.name,
      found.email,
      found.password,
      found.roleId.id,
      found.createdAt,
      found.updatedAt,
      found.status_user
    );
  }

  async findById(id: number): Promise<User | null> {
    const found = await this.repo.findOne({
      where: { id },
      relations: ["roleId"],
    });
    if (!found) return null;

    return new User(
      found.id,
      found.name,
      found.email,
      found.password,
      found.roleId.id,
      found.createdAt,
      found.updatedAt,
      found.status_user
    );
  }

  async findAll(): Promise<User[]> {
    const all = await this.repo.find({
      relations: ["roleId"],
    });
    return all.map(
      (u) =>
        new User(
          u.id,
          u.name,
          u.email,
          u.password,
          u.roleId.id,
          u.createdAt,
          u.updatedAt,
          u.status_user
        )
    );
  }

  async update(entity: User): Promise<User> {
    const updated = await this.repo.save({
      id: entity.id,
      name: entity.name,
      email: entity.email,
      password: entity.password,
      roleId: { id: entity.roleId },
      status_user: entity.status_user,
    });

    // Reload to get the full entity with relations
    const reloaded = await this.repo.findOne({
      where: { id: updated.id },
      relations: ["roleId"],
    });

    if (!reloaded) throw new Error("Failed to update user");

    return new User(
      reloaded.id,
      reloaded.name,
      reloaded.email,
      reloaded.password,
      reloaded.roleId.id,
      reloaded.createdAt,
      reloaded.updatedAt,
      reloaded.status_user
    );
  }

  async getPreferences(userId: number): Promise<number[]> {
    const user = await this.repo.findOne({
      where: { id: userId },
      relations: ["preferences", "preferences.category"],
    });
    return user?.preferences.map((p) => p.category.id) ?? [];
  }
}
