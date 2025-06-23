// domain/dtos/UserDTO.ts
export default class UserDTO {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly password: string,
    public readonly roleId: number
  ) {
    if (!name.trim()) throw new Error("Name is required");
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      throw new Error("Invalid email");
    if (password.length < 6) throw new Error("Password too short");
    if (!Number.isInteger(roleId) || roleId <= 0)
      throw new Error("Invalid role ID");
  }
}
