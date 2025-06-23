// domain/ports/IUserRepository.ts
import { User } from "../entities/User";
export interface IUserRepository {
  create(entity: User): Promise<User>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  update(entity: User): Promise<User>;
  findAll(): Promise<User[]>;
}
