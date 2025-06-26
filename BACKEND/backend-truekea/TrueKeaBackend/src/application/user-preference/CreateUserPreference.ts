import { UserPreference } from "../../domain/entities/UserPreference";
import { IUserPreferenceRepository } from "../../domain/ports/IUserPreferenceRepository";
import { UserPreferenceRepository } from "../../infrastructure/adapter/typeorm/repositories/UserPreferenceRepository";

export default class CreateUserPreference {
  private repo: IUserPreferenceRepository;

  constructor() {
    this.repo = new UserPreferenceRepository();
  }

  async execute(pref: UserPreference): Promise<UserPreference> {
    return await this.repo.create(pref);
  }
}
