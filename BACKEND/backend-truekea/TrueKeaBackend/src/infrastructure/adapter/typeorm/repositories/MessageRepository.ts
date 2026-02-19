import { getRepository } from "typeorm";
import { MessageEntity } from "../entities/MessageEntity";
import {
  IMessageRepository,
  ConversationSummary,
} from "../../../../domain/ports/IMessageRepository";
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
      relations: ["sender", "receiver", "item"],
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

  async getAllByReceiverId(receiverId: number): Promise<Message[]> {
    const messages = await this.repo.find({
      where: { receiver: { id: receiverId } },
      order: { createdAt: "DESC" },
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

  async getConversationsByUserId(userId: number): Promise<ConversationSummary[]> {
    const messages = await this.repo.find({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ["sender", "receiver", "item"],
      order: { createdAt: "DESC" },
    });
    const seen = new Map<string, ConversationSummary>();
    for (const m of messages) {
      const otherUser = m.sender.id === userId ? m.receiver : m.sender;
      const key = `${m.item.id}-${otherUser.id}`;
      if (seen.has(key)) continue;
      seen.set(key, {
        itemId: m.item.id,
        item: {
          id: m.item.id,
          name: m.item.title,
          image: m.item.img_item,
        },
        otherUser: { id: otherUser.id, name: otherUser.name },
        lastMessage: {
          content: m.content,
          timestamp: m.createdAt?.toISOString?.() ?? String(m.createdAt),
          senderId: m.sender.id,
        },
        unreadCount: 0,
      });
    }
    return Array.from(seen.values());
  }
}
