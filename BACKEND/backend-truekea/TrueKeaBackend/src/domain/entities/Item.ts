export class Item {
  constructor(
    public id: number,
    public readonly title: string,
    public readonly description: string,
    public value: number,
    public categoryId: number,
    public ownerId: number,
    public img_item?: string,
    public weightKg?: number
  ) {
    if (!title.trim()) throw new Error("Title required");
    if (!description.trim()) throw new Error("Description required");
    if (value <= 0) throw new Error("Value must be positive");
    if (!Number.isInteger(categoryId) || categoryId <= 0)
      throw new Error("Invalid categoryId");
    if (!Number.isInteger(ownerId) || ownerId <= 0)
      throw new Error("Invalid ownerId");
  }
}
