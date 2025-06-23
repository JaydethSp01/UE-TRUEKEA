// infrastructure/adapter/typeorm/entities/UserPreferenceEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity({ name: "user_preferences" })
export class UserPreferenceEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.preferences, { eager: true })
  user: UserEntity;

  @Column({ type: "varchar", length: 100 })
  key: string;

  @Column({ type: "varchar", length: 255 })
  value: string;
}
