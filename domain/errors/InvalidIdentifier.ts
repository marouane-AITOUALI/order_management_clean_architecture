export class InvalidIdentifier extends Error {
  public override readonly name = "InvalidIdentifier";

  public constructor(public readonly identifier: string) {
    super();
  }
}
