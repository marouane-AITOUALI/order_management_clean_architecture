import { OrderStatus } from "../enumerations/OrderStatus";

export class InvalidStatusTransition extends Error {
  public override readonly name = "InvalidStatusTransition";

  public constructor(
    public readonly from: OrderStatus,
    public readonly to: OrderStatus
  ) {
    super();
  }
}
