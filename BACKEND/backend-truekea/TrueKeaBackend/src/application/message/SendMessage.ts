// application/message/SendMessage.ts
import { IMessageRepository } from "../../domain/ports/IMessageRepository";
import MessageDTO from "../../domain/dtos/MessageDTO";
import { Message } from "../../domain/entities/Message";
import { MessageRepository } from "../../infrastructure/adapter/typeorm/repositories/MessageRepository";

export default class SendMessage {
  private repo: IMessageRepository;
  constructor() {
    this.repo = new MessageRepository();
  }
  async execute(dto: MessageDTO): Promise<Message> {
    try {
      const entity = new Message(
        0,
        dto.senderId,
        dto.receiverId,
        dto.content,
        new Date()
      );
      return await this.repo.create(entity);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
