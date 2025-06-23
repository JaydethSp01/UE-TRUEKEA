// application/auth/AuthenticateUser.ts
import { IUserRepository } from "../../domain/ports/IUserRepository";
import AuthDTO from "../../domain/dtos/AuthDTO";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../infrastructure/config/default";
import { UserRepository } from "../../infrastructure/adapter/typeorm/repositories/UserRepository";

export default class AuthenticateUser {
  private userRepo: IUserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async execute(
    dto: AuthDTO
  ): Promise<{ token: string; refreshToken: string }> {
    try {
      const user = await this.userRepo.findByEmail(dto.email);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const match = await bcrypt.compare(dto.password, user.password);
      if (!match) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign({ sub: user.id }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as unknown as number,
      });

      const refreshToken = jwt.sign(
        { sub: user.id },
        config.jwt.refreshSecret,
        { expiresIn: config.jwt.refreshExpiresIn as unknown as number }
      );

      return { token, refreshToken };
    } catch (err: any) {
      throw new Error(err.message || "Authentication failed");
    }
  }
}
