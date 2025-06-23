// infrastructure/adapter/typeorm/entities/UserEntity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { ItemEntity } from "./ItemEntity";
import { MessageEntity } from "./MessageEntity";
import { SwapEntity } from "./SwapEntity";
import { RatingEntity } from "./RatingEntity";
import { RoleEntity } from "./RoleEntity";
import { UserPreferenceEntity } from "./UserPreferenceEntity";

@Entity({ name: "users" })
export class UserEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", length: 100 })
  name: string;

  @Column({ type: "varchar", length: 100, unique: true })
  email: string;

  @Column({ type: "varchar", length: 255 })
  password: string;

  @ManyToOne(() => RoleEntity, (role) => role.users, { eager: true })
  @JoinColumn({ name: "roleId" })
  roleId: RoleEntity;

  @OneToMany(() => ItemEntity, (item) => item.owner)
  items: ItemEntity[];

  @OneToMany(() => MessageEntity, (msg) => msg.sender)
  sentMessages: MessageEntity[];

  @OneToMany(() => MessageEntity, (msg) => msg.receiver)
  receivedMessages: MessageEntity[];

  @OneToMany(() => SwapEntity, (swap) => swap.requester)
  requestedSwaps: SwapEntity[];

  @OneToMany(() => SwapEntity, (swap) => swap.respondent)
  respondentSwaps: SwapEntity[];

  @OneToMany(() => RatingEntity, (rating) => rating.rater)
  ratings: RatingEntity[];

  @OneToMany(() => UserPreferenceEntity, (pref) => pref.user)
  preferences: UserPreferenceEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
