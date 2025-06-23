// domain/entities/UserPreference.ts
export class UserPreference {
  constructor(
    public id: number,
    public userId: number,
    public key: string,
    public value: string
  ) {
    if (!Number.isInteger(userId) || userId <= 0)
      throw new Error("Invalid user ID");
    if (!key.trim()) throw new Error("Key required");
  }
}
