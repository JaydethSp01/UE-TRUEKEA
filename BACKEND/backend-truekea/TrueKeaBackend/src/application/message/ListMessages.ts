import { IMessageRepository } from "../../domain/ports/IMessageRepository";
import { Message } from "../../domain/entities/Message";
import { MessageRepository } from "../../infrastructure/adapter/typeorm/repositories/MessageRepository";

export default class ListMessages {
  private repo: IMessageRepository;

  constructor() {
    this.repo = new MessageRepository();
  }

  async execute(
    itemId: number,
    userAId: number,
    userBId: number
  ): Promise<Message[]> {
    return await this.repo.getConversation(itemId, userAId, userBId);
  }
}
