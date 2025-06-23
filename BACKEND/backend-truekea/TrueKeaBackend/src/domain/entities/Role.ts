// domain/entities/Role.ts
export class Role {
  constructor(public id: number, public name: string) {
    if (!name.trim()) throw new Error("Role name required");
  }
}
