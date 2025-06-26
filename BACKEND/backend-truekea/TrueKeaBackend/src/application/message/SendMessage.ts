import { Message } from "../../domain/entities/Message";
import { IMessageRepository } from "../../domain/ports/IMessageRepository";
import MessageDTO from "../../domain/dtos/MessageDTO";
import { MessageRepository } from "../../infrastructure/adapter/typeorm/repositories/MessageRepository";

export default class SendMessage {
  private repo: IMessageRepository;

  constructor() {
    this.repo = new MessageRepository();
  }

  async execute(dto: MessageDTO): Promise<Message> {
    const entity = new Message(
      0,
      dto.senderId,
      dto.receiverId,
      dto.itemId,
      dto.content
    );
    return await this.repo.send(entity);
  }
}
