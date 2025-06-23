// infrastructure/adapter/typeorm/repositories/MessageRepository.ts
import { getRepository } from "typeorm";
import { MessageEntity } from "../entities/MessageEntity";
import { IMessageRepository } from "../../../../domain/ports/IMessageRepository";
import { Message } from "../../../../domain/entities/Message";

export class MessageRepository implements IMessageRepository {
  private repo = getRepository(MessageEntity);

  async create(entity: Message): Promise<Message> {
    try {
      return await this.repo.save(entity);
    } catch {
      throw new Error("Error sending message");
    }
  }
}
