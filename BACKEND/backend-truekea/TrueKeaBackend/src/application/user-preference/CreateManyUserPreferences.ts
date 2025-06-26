import { UserPreference } from "../../domain/entities/UserPreference";
import { IUserPreferenceRepository } from "../../domain/ports/IUserPreferenceRepository";
import { UserPreferenceRepository } from "../../infrastructure/adapter/typeorm/repositories/UserPreferenceRepository";

export default class CreateManyUserPreferences {
  private repo: IUserPreferenceRepository;

  constructor() {
    this.repo = new UserPreferenceRepository();
  }

  async execute(prefs: UserPreference[]): Promise<void> {
    await this.repo.createMany(prefs);
  }
}
