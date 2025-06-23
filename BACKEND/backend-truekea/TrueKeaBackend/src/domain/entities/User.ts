// domain/entities/User.ts
export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public roleId: number,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    if (!name.trim()) throw new Error("Name required");
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      throw new Error("Invalid email");
    if (password.length < 6) throw new Error("Password too short");
    if (!Number.isInteger(roleId) || roleId <= 0)
      throw new Error("Invalid role ID");
  }
}
