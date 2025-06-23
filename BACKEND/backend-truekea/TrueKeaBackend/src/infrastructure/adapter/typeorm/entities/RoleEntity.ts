// infrastructure/adapter/typeorm/entities/RoleEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity({ name: "roles" })
export class RoleEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", length: 50, unique: true })
  name: string;

  @OneToMany(() => UserEntity, (user) => user.roleId)
  users: UserEntity[];
}
