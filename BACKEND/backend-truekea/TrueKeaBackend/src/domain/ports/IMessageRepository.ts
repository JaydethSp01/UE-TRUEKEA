import { Message } from "../entities/Message";

export interface IMessageRepository {
  send(message: Message): Promise<Message>;
  getConversation(
    itemId: number,
    userAId: number,
    userBId: number
  ): Promise<Message[]>;
}
