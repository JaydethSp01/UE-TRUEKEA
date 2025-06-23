export type SwapStatus = "pending" | "accepted" | "completed" | "rejected";
export class Swap {
  constructor(
    public id: number,
    public requesterId: number,
    public respondentId: number,
    public requestedItemId: number,
    public offeredItemId: number,
    public status: SwapStatus,
    public createdAt: Date,
    public updatedAt: Date
  ) {
    [requesterId, respondentId, requestedItemId, offeredItemId].forEach(
      (id) => {
        if (!Number.isInteger(id) || id <= 0) throw new Error("Invalid ID");
      }
    );
  }
}
