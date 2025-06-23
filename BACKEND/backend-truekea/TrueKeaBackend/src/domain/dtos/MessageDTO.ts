// domain/dtos/MessageDTO.ts
export default class MessageDTO {
  constructor(
    public readonly senderId: number,
    public readonly receiverId: number,
    public readonly content: string
  ) {
    [senderId, receiverId].forEach((id) => {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid user ID");
    });
    if (!content.trim()) throw new Error("Content is required");
  }
}
