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
    });

    return new User(
      saved.id,
      saved.name,
      saved.email,
      saved.password,
      saved.roleId.id,
      saved.createdAt,
      saved.updatedAt
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const found = await this.repo.findOne({ where: { email } });
    if (!found) return null;

    return new User(
      found.id,
      found.name,
      found.email,
      found.password,
      found.roleId.id,
      found.createdAt,
      found.updatedAt
    );
  }

  async findById(id: number): Promise<User | null> {
    const found = await this.repo.findOne({ where: { id } });
    if (!found) return null;

    return new User(
      found.id,
      found.name,
      found.email,
      found.password,
      found.roleId.id,
      found.createdAt,
      found.updatedAt
    );
  }

  async findAll(): Promise<User[]> {
    const all = await this.repo.find();
    return all.map(
      (u) =>
        new User(
          u.id,
          u.name,
          u.email,
          u.password,
          u.roleId.id,
          u.createdAt,
          u.updatedAt
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
    });

    return new User(
      updated.id,
      updated.name,
      updated.email,
      updated.password,
      updated.roleId.id,
      updated.createdAt,
      updated.updatedAt
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
