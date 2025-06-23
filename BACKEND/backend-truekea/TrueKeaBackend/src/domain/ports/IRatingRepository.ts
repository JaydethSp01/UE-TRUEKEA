// domain/ports/IRatingRepository.ts
import { Rating } from "../entities/Rating";
export interface IRatingRepository {
  create(entity: Rating): Promise<Rating>;
}
