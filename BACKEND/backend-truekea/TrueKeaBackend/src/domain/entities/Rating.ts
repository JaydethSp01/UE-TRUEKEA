// domain/entities/Rating.ts
export class Rating {
  constructor(
    public id: number,
    public swapId: number,
    public raterId: number,
    public score: number,
    public comment: string | null,
    public createdAt: Date
  ) {
    [swapId, raterId].forEach((id) => {
      if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid ID");
    });
    if (score < 1 || score > 5) throw new Error("Score must be 1–5");
  }
}
