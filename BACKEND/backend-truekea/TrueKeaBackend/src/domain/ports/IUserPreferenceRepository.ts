// domain/ports/IUserPreferenceRepository.ts
import { UserPreference } from "../entities/UserPreference";
export interface IUserPreferenceRepository {
  create(entity: UserPreference): Promise<UserPreference>;
  findByUserId(userId: number): Promise<UserPreference[]>;
}
