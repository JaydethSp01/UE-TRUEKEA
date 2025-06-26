// domain/entities/UserPreference.ts
export class UserPreference {
  constructor(
    public id: number,
    public userId: number,
    public categoryId: number
  ) {
    if (!Number.isInteger(userId) || userId <= 0)
      throw new Error("Invalid user ID");
    if (!Number.isInteger(categoryId) || categoryId <= 0)
      throw new Error("Invalid category ID");
  }
}
