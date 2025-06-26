// domain/entities/Message.ts
export class Message {
  constructor(
    public id: number,
    public senderId: number,
    public receiverId: number,
    public itemId: number,
    public content: string,
    public createdAt?: Date
  ) {
    [senderId, receiverId].forEach((id) => {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid user ID");
    });
    if (!content.trim()) throw new Error("Content required");
  }
}
