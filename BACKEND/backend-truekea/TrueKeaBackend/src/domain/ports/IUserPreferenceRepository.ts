import { UserPreference } from "../entities/UserPreference";

export interface IUserPreferenceRepository {
  create(entity: UserPreference): Promise<UserPreference>;
  createMany(entities: UserPreference[]): Promise<void>;
  findByUserId(userId: number): Promise<UserPreference[]>;
  deleteAllByUserId(userId: number): Promise<void>;
  updateAll(userId: number, newPrefs: UserPreference[]): Promise<void>;
}
