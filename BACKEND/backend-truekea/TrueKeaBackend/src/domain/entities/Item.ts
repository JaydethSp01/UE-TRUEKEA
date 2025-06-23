// domain/entities/Item.ts
export class Item {
  constructor(
    public id: number,
    public readonly title: string,
    public readonly description: string,
    public value: number,
    public categoryId: number,
    public ownerId: number,
    public img_item?: string
  ) {
    if (!title.trim()) {
      throw new Error("Title required");
    }

    if (!description.trim()) {
      throw new Error("Description required");
    }

    if (value <= 0) {
      throw new Error("Value must be positive");
    }
  }
}
