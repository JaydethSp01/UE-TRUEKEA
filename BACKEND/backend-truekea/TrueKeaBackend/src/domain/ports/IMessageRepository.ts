// domain/ports/IMessageRepository.ts
import { Message } from "../entities/Message";
export interface IMessageRepository {
  create(entity: Message): Promise<Message>;
}
