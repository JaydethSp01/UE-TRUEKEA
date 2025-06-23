// application/rating/RateSwap.ts
import { IRatingRepository } from "../../domain/ports/IRatingRepository";
import RatingDTO from "../../domain/dtos/RatingDTO";
import { Rating } from "../../domain/entities/Rating";
import { RatingRepository } from "../../infrastructure/adapter/typeorm/repositories/RatingRepository";

export default class RateSwap {
  private repo: IRatingRepository;
  constructor() {
    this.repo = new RatingRepository();
  }
  async execute(dto: RatingDTO): Promise<Rating> {
    try {
      const entity = new Rating(
        0,
        dto.swapId,
        dto.raterId,
        dto.score,
        dto.comment || null,
        new Date()
      );
      return await this.repo.create(entity);
    } catch (err: any) {
      throw new Error(err.message);
    }
  }
}
