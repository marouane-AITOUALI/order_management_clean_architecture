export class OrderSaveFailed extends Error {
  public override readonly name = "OrderSaveFailed";

  public constructor(public readonly reason: string) {
    super();
  }
}
