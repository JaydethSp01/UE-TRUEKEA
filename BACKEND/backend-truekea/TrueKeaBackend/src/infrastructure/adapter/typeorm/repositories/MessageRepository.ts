import { getRepository } from "typeorm";
import { MessageEntity } from "../entities/MessageEntity";
import { IMessageRepository } from "../../../../domain/ports/IMessageRepository";
import { Message } from "../../../../domain/entities/Message";

export class MessageRepository implements IMessageRepository {
  private repo = getRepository(MessageEntity);

  async send(message: Message): Promise<Message> {
    const saved = await this.repo.save({
      sender: { id: message.senderId },
      receiver: { id: message.receiverId },
      item: { id: message.itemId },
      content: message.content,
    });
    return new Message(
      saved.id,
      message.senderId,
      message.receiverId,
      message.itemId,
      message.content,
      saved.createdAt
    );
  }

  async getConversation(
    itemId: number,
    userAId: number,
    userBId: number
  ): Promise<Message[]> {
    const messages = await this.repo.find({
      where: [
        {
          item: { id: itemId },
          sender: { id: userAId },
          receiver: { id: userBId },
        },
        {
          item: { id: itemId },
          sender: { id: userBId },
          receiver: { id: userAId },
        },
      ],
      order: { createdAt: "ASC" },
    });

    return messages.map(
      (m) =>
        new Message(
          m.id,
          m.sender.id,
          m.receiver.id,
          m.item.id,
          m.content,
          m.createdAt
        )
    );
  }
}
