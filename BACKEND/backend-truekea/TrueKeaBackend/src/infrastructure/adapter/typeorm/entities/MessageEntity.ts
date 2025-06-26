import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity";
import { ItemEntity } from "./ItemEntity";

@Entity({ name: "messages" })
export class MessageEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.sentMessages)
  sender: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.receivedMessages)
  receiver: UserEntity;

  @ManyToOne(() => ItemEntity, (item) => item.messages)
  item: ItemEntity;

  @Column({ type: "text" })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
