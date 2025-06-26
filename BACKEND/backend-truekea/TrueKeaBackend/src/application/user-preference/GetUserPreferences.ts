import { IUserPreferenceRepository } from "../../domain/ports/IUserPreferenceRepository";
import { UserPreference } from "../../domain/entities/UserPreference";
import { UserPreferenceRepository } from "../../infrastructure/adapter/typeorm/repositories/UserPreferenceRepository";

export default class GetUserPreferences {
  private repo: IUserPreferenceRepository;

  constructor() {
    this.repo = new UserPreferenceRepository();
  }

  async execute(userId: number): Promise<UserPreference[]> {
    return await this.repo.findByUserId(userId);
  }
}
