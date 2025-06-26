import { IUserPreferenceRepository } from "../../domain/ports/IUserPreferenceRepository";
import { UserPreferenceRepository } from "../../infrastructure/adapter/typeorm/repositories/UserPreferenceRepository";

export default class DeleteAllUserPreferences {
  private repo: IUserPreferenceRepository;

  constructor() {
    this.repo = new UserPreferenceRepository();
  }

  async execute(userId: number): Promise<void> {
    await this.repo.deleteAllByUserId(userId);
  }
}
