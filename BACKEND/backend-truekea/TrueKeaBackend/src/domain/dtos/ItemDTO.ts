export default class ItemDTO {
  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly value: number,
    public readonly categoryId: number,
    public readonly ownerId: number
  ) {
    if (!title.trim()) {
      throw new Error("Title is required");
    }
    if (!description.trim()) {
      throw new Error("Description is required");
    }
    if (value <= 0) {
      throw new Error("Value must be positive");
    }

    [categoryId, ownerId].forEach((id) => {
      if (!Number.isInteger(id) || id <= 0) {
        throw new Error("Invalid ID");
      }
    });
  }
}
