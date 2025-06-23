// application/user/RegisterUser.ts
import { IUserRepository } from "../../domain/ports/IUserRepository";
import UserDTO from "../../domain/dtos/UserDTO";
import { User } from "../../domain/entities/User";
import bcrypt from "bcrypt";
import { UserRepository } from "../../infrastructure/adapter/typeorm/repositories/UserRepository";

export default class RegisterUser {
  private repo: IUserRepository;
  constructor() {
    this.repo = new UserRepository();
  }
  async execute(dto: UserDTO): Promise<User> {
    try {
      const hash = await bcrypt.hash(dto.password, 10);
      const entity = new User(
        0,
        dto.name,
        dto.email,
        hash,
        dto.roleId,
        new Date(),
        new Date()
      );
      return await this.repo.create(entity);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
