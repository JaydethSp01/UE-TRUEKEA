// infrastructure/adapter/typeorm/entities/ItemEntity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { CategoryEntity } from "./CategoryEntity";
import { UserEntity } from "./UserEntity";
import { SwapEntity } from "./SwapEntity";

@Entity({ name: "items" })
export class ItemEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "varchar", length: 200 })
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  value: number;

  @ManyToOne(() => CategoryEntity, (category) => category.items, {
    eager: true,
  })
  category: CategoryEntity;

  @ManyToOne(() => UserEntity, (user) => user.items, { eager: true })
  owner: UserEntity;

  @OneToMany(() => SwapEntity, (swap) => swap.requestedItem)
  requestedSwaps: SwapEntity[];

  @OneToMany(() => SwapEntity, (swap) => swap.offeredItem)
  offeredSwaps: SwapEntity[];

  @Column({ type: "varchar", length: 500, nullable: true })
  img_item: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
