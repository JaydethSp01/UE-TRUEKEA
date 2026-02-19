import { Message } from "../entities/Message";

export interface ConversationSummary {
  itemId: number;
  item: { id: number; name: string; image?: string };
  otherUser: { id: number; name: string };
  lastMessage: { content: string; timestamp: string; senderId: number };
  unreadCount: number;
}

export interface IMessageRepository {
  send(message: Message): Promise<Message>;
  getConversation(
    itemId: number,
    userAId: number,
    userBId: number
  ): Promise<Message[]>;
  getAllByReceiverId(receiverId: number): Promise<Message[]>;
  getConversationsByUserId(userId: number): Promise<ConversationSummary[]>;
}
