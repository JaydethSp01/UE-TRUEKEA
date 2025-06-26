// infrastructure/adapter/typeorm/entities/UserPreferenceEntity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./UserEntity";
import { CategoryEntity } from "./CategoryEntity";

@Entity({ name: "user_preferences" })
export class UserPreferenceEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.preferences, { eager: true })
  user: UserEntity;

  @ManyToOne(() => CategoryEntity, { eager: true })
  category: CategoryEntity;
}
