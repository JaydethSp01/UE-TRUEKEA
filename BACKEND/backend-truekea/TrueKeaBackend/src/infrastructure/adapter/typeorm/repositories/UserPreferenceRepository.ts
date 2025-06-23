// infrastructure/adapter/typeorm/repositories/UserPreferenceRepository.ts
import { getRepository } from "typeorm";
import { UserPreferenceEntity } from "../entities/UserPreferenceEntity";
import { IUserPreferenceRepository } from "../../../../domain/ports/IUserPreferenceRepository";
import { UserPreference } from "../../../../domain/entities/UserPreference";

export class UserPreferenceRepository implements IUserPreferenceRepository {
  private repo = getRepository(UserPreferenceEntity);

  async create(entity: UserPreference): Promise<UserPreference> {
    try {
      return await this.repo.save(entity);
    } catch {
      throw new Error("Error creating preference");
    }
  }

  async findByUserId(userId: number): Promise<UserPreference[]> {
    try {
      const results = await this.repo.find({
        where: { user: { id: userId } },
        relations: ["user"], // Necesario para acceder a user.id
      });

      return results.map(
        (pref) =>
          new UserPreference(
            pref.id,
            pref.user.id, // asegurarse que pref.user está cargado
            pref.key,
            pref.value
          )
      );
    } catch {
      return [];
    }
  }
}
