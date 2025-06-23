// infrastructure/adapter/typeorm/entities/SwapEntity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserEntity } from "./UserEntity";
import { ItemEntity } from "./ItemEntity";
import { RatingEntity } from "./RatingEntity";

@Entity({ name: "swaps" })
export class SwapEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.requestedSwaps, { eager: true })
  requester: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.respondentSwaps, { eager: true })
  respondent: UserEntity;

  @ManyToOne(() => ItemEntity, (item) => item.requestedSwaps, { eager: true })
  requestedItem: ItemEntity;

  @ManyToOne(() => ItemEntity, (item) => item.offeredSwaps, { eager: true })
  offeredItem: ItemEntity;

  @Column({ type: "varchar", length: 20 })
  status: string;

  @OneToMany(() => RatingEntity, (rating) => rating.swap)
  ratings: RatingEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
