// application/user/UpdateUserProfile.ts
import { IUserRepository } from "../../domain/ports/IUserRepository";
import UserDTO from "../../domain/dtos/UserDTO";
import { User } from "../../domain/entities/User";
import bcrypt from "bcrypt";
import { UserRepository } from "../../infrastructure/adapter/typeorm/repositories/UserRepository";

export default class UpdateUserProfile {
  private repo: IUserRepository;
  constructor() {
    this.repo = new UserRepository();
  }
  async execute(data: Partial<UserDTO> & { id: string }): Promise<User> {
    try {
      const existing = await this.repo.findById(Number(data.id));
      if (!existing) throw new Error("User not found");
      const hash = data.password
        ? await bcrypt.hash(data.password, 10)
        : existing.password;
      const entity = new User(
        existing.id,
        data.name || existing.name,
        data.email || existing.email,
        hash,
        data.roleId || existing.roleId,
        existing.createdAt,
        new Date()
      );
      return await this.repo.update(entity);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
