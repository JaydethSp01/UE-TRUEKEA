import { IUserRepository } from "../../domain/ports/IUserRepository";
import { User } from "../../domain/entities/User";

export class DeactivateUser {
  constructor(private userRepository: IUserRepository) {}

  async execute(userId: number): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    user.status_user = "inactive";

    return this.userRepository.update(user);
  }
} 