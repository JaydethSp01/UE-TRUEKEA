// infrastructure/adapter/typeorm/entities/MessageEntity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity";

@Entity({ name: "messages" })
export class MessageEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.sentMessages, { eager: true })
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedMessages, { eager: true })
  receiver: UserEntity;

  @Column({ type: "text" })
  content: string;

  @CreateDateColumn()
  timestamp: Date;
}
