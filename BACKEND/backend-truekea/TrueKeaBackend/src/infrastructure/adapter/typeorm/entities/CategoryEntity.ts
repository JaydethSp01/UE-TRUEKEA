// infrastructure/adapter/typeorm/entities/CategoryEntity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { ItemEntity } from "./ItemEntity";

@Entity({ name: "categories" })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({ type: "double precision", nullable: false })
  co2: number;

  @OneToMany(() => ItemEntity, (item) => item.category)
  items: ItemEntity[];
}
