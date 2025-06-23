// domain/dtos/RatingDTO.ts
export default class RatingDTO {
  constructor(
    public readonly swapId: number,
    public readonly raterId: number,
    public readonly score: number,
    public readonly comment?: string
  ) {
    [swapId, raterId].forEach((id) => {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid ID");
    });
    if (score < 1 || score > 5) throw new Error("Score must be 1–5");
  }
}
