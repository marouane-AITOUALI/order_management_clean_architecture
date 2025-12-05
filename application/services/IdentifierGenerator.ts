import { InvalidIdentifier } from "../../domain/errors/InvalidIdentifier";
import { Identifier } from "../../domain/values/Identifier";

export interface IdentifierGenerator {
  create(): Identifier | InvalidIdentifier;
}
