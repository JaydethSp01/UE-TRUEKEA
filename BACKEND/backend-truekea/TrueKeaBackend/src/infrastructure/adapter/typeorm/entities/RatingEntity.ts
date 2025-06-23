// infrastructure/adapter/typeorm/entities/RatingEntity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { SwapEntity } from "./SwapEntity";
import { UserEntity } from "./UserEntity";

@Entity({ name: "ratings" })
export class RatingEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => SwapEntity, (swap) => swap.ratings, { eager: true })
  swap: SwapEntity;

  @ManyToOne(() => UserEntity, (user) => user.ratings, { eager: true })
  rater: UserEntity;

  @Column({ type: "int" })
  score: number;

  @Column({ type: "text", nullable: true })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
