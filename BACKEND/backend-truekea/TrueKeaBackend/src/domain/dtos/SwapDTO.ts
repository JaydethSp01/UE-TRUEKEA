// domain/dtos/SwapDTO.ts
import { SwapStatus } from "../entities/Swap";

const ALLOWED_STATUSES: SwapStatus[] = [
  "pending",
  "accepted",
  "completed",
  "rejected",
];

export default class SwapDTO {
  public readonly id: number;
  public readonly requesterId: number;
  public readonly respondentId: number;
  public readonly requestedItemId: number;
  public readonly offeredItemId: number;
  public readonly status: SwapStatus;

  constructor(
    id: number,
    requesterId: number,
    respondentId: number,
    requestedItemId: number,
    offeredItemId: number,
    status?: string // puede venir undefined o cualquier string
  ) {
    // IDs
    [id, requesterId, respondentId, requestedItemId, offeredItemId].forEach(
      (n, idx) => {
        if (!Number.isInteger(n) || n <= 0) {
          throw new Error(`Invalid ID at position ${idx}: ${n}`);
        }
      }
    );
    this.id = id;
    this.requesterId = requesterId;
    this.respondentId = respondentId;
    this.requestedItemId = requestedItemId;
    this.offeredItemId = offeredItemId;

    // Status
    if (!status) {
      this.status = "pending";
    } else if (ALLOWED_STATUSES.includes(status as SwapStatus)) {
      this.status = status as SwapStatus;
    } else {
      throw new Error(`Invalid status: ${status}`);
    }
  }
}
