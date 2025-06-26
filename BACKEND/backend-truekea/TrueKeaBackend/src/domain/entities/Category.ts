// domain/entities/Category.ts
export class Category {
  constructor(public id: number, public name: string, public co2: number) {
    if (!name.trim()) throw new Error("Category name required");
  }
}
