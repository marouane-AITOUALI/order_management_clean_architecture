import { randomUUID } from "crypto";
import { IdentifierGenerator } from "../../../application/services/IdentifierGenerator";
import { InvalidIdentifier } from "../../../domain/errors/InvalidIdentifier";
import { Identifier } from "../../../domain/values/Identifier";

export class NodeIdentifierGenerator implements IdentifierGenerator {
  public create(): Identifier | InvalidIdentifier {
    const id = randomUUID();
    const identifier = Identifier.from(`ORDER-${id}`);

    return identifier;
  }
}
