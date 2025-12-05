import { InvalidIdentifier } from "../errors/InvalidIdentifier";

export class Identifier {
  private constructor(public readonly value: string) {}

  public static from(value: string): Identifier | InvalidIdentifier {
    if (!value.startsWith("ORDER-")) {
      return new InvalidIdentifier(value);
    }

    return new Identifier(value);
  }
}
