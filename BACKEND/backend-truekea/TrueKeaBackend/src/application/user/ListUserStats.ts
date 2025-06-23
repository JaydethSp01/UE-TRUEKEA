// application/user/ListUserStats.ts
import { IUserRepository } from "../../domain/ports/IUserRepository";
import { UserRepository } from "../../infrastructure/adapter/typeorm/repositories/UserRepository";

export default class ListUserStats {
  private repo: IUserRepository;
  constructor() {
    this.repo = new UserRepository();
  }
  async execute(): Promise<any> {
    try {
      const users = await this.repo.findAll?.();
      const total = Array.isArray(users) ? users.length : 0;
      return { totalUsers: total };
    } catch (err) {
      throw new Error("Error fetching stats");
    }
  }
}
