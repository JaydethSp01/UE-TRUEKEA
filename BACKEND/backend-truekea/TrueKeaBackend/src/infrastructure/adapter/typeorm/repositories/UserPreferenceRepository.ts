// infrastructure/adapter/typeorm/repositories/UserPreferenceRepository.ts
import { getRepository } from "typeorm";
import { UserPreferenceEntity } from "../entities/UserPreferenceEntity";
import { IUserPreferenceRepository } from "../../../../domain/ports/IUserPreferenceRepository";
import { UserPreference } from "../../../../domain/entities/UserPreference";

export class UserPreferenceRepository implements IUserPreferenceRepository {
  private repo = getRepository(UserPreferenceEntity);

  async create(domainEntity: UserPreference): Promise<UserPreference> {
    try {
      const toSave = this.repo.create({
        user: { id: domainEntity.userId },
        category: { id: domainEntity.categoryId },
      });

      const saved = await this.repo.save(toSave);
      return new UserPreference(saved.id, saved.user.id, saved.category.id);
    } catch (err) {
      throw new Error("Error creating preference: " + (err as Error).message);
    }
  }

  async createMany(entities: UserPreference[]): Promise<void> {
    try {
      const toSave = entities.map((e) =>
        this.repo.create({
          user: { id: e.userId },
          category: { id: e.categoryId },
        })
      );
      await this.repo.save(toSave);
    } catch (err) {
      throw new Error("Error saving preferences: " + (err as Error).message);
    }
  }

  async findByUserId(userId: number): Promise<UserPreference[]> {
    try {
      const results = await this.repo.find({
        where: { user: { id: userId } },
        relations: ["user", "category"],
      });

      return results.map(
        (pref) => new UserPreference(pref.id, pref.user.id, pref.category.id)
      );
    } catch {
      return [];
    }
  }

  async deleteAllByUserId(userId: number): Promise<void> {
    try {
      await this.repo.delete({ user: { id: userId } });
    } catch (err) {
      throw new Error("Error deleting preferences: " + (err as Error).message);
    }
  }

  async updateAll(userId: number, newPrefs: UserPreference[]): Promise<void> {
    await this.deleteAllByUserId(userId);
    await this.createMany(newPrefs);
  }
}
