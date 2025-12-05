export class OrderMustHaveAtLeastOneLine extends Error {
  public override readonly name = "OrderMustHaveAtLeastOneLine";

  public constructor() {
    super();
  }
}
