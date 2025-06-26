export default class MessageDTO {
  constructor(
    public senderId: number,
    public receiverId: number,
    public itemId: number,
    public content: string
  ) {}
}
