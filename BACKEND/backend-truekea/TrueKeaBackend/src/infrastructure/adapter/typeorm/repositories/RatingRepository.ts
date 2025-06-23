import { getRepository } from "typeorm";
import { RatingEntity } from "../entities/RatingEntity";
import { IRatingRepository } from "../../../../domain/ports/IRatingRepository";
import { Rating } from "../../../../domain/entities/Rating";
import { SwapEntity } from "../entities/SwapEntity";
import { UserEntity } from "../entities/UserEntity";

export class RatingRepository implements IRatingRepository {
  private repo = getRepository(RatingEntity);

  async create(entity: Rating): Promise<Rating> {
    try {
      const saved = await this.repo.save({
        swap: { id: entity.swapId } as SwapEntity,
        rater: { id: entity.raterId } as UserEntity,
        score: entity.score,
        comment: entity.comment ?? undefined,
        createdAt: entity.createdAt,
      });

      return new Rating(
        saved.id,
        saved.swap.id,
        saved.rater.id,
        saved.score,
        saved.comment,
        saved.createdAt
      );
    } catch {
      throw new Error("Error creating rating");
    }
  }
}
