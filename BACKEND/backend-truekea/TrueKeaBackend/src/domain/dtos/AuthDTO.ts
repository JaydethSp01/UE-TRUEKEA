// domain/dtos/AuthDTO.ts
export default class AuthDTO {
  constructor(public readonly email: string, public readonly password: string) {
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))
      throw new Error("Invalid email");
    if (password.length < 6) throw new Error("Password too short");
  }
}
