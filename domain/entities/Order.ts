import { Entity } from "./Entity";
import { OrderLine } from "./OrderLine";
import { OrderStatus } from "../enumerations/OrderStatus";
import { OrderCannotBeCanceled } from "../errors/OrderCannotBeCanceled";
import { OrderLineCannotBeModified } from "../errors/OrderLineCannotBeModified";
import { InvalidQuantity } from "../errors/InvalidQuantity";
import { OrderMustHaveAtLeastOneLine } from "../errors/OrderMustHaveAtLeastOneLine";
import { InvalidStatusTransition } from "../errors/InvalidStatusTransition";
import { Identifier } from "../values/Identifier";

export class Order implements Entity {
  public constructor(
    public readonly identifier: Identifier,
    public readonly lines: OrderLine[],
    public readonly status: OrderStatus,
    public readonly updatedAt: Date,
    public readonly createdAt: Date
  ) {}

  public get totalAmount(): number {
    return this.lines.reduce((sum, line) => sum + line.totalAmount, 0);
  }

  public cancel(): Order | OrderCannotBeCanceled {
    if (
      this.status === OrderStatus.Paid ||
      this.status === OrderStatus.Shipped
    ) {
      return new OrderCannotBeCanceled(this.status);
    }

    return new Order(
      this.identifier,
      this.lines,
      OrderStatus.Canceled,
      new Date(),
      this.createdAt
    );
  }

  public addLine(line: OrderLine): Order | OrderLineCannotBeModified {
    if (
      this.status === OrderStatus.Canceled ||
      this.status === OrderStatus.Shipped
    ) {
      return new OrderLineCannotBeModified(this.status);
    }

    const existingLineIndex = this.lines.findIndex(
      (l) => l.productId === line.productId
    );

    if (existingLineIndex !== -1) {
      const existingLine = this.lines[existingLineIndex];
      const updatedLine = existingLine.updateQuantity(
        existingLine.quantity + line.quantity
      );

      if (updatedLine instanceof InvalidQuantity) {
        return new OrderLineCannotBeModified(this.status);
      }

      const newLines = [...this.lines];
      newLines[existingLineIndex] = updatedLine;

      return new Order(
        this.identifier,
        newLines,
        this.status,
        new Date(),
        this.createdAt
      );
    }

    return new Order(
      this.identifier,
      [...this.lines, line],
      this.status,
      new Date(),
      this.createdAt
    );
  }

  public removeLine(
    lineIdentifier: string
  ): Order | OrderLineCannotBeModified | OrderMustHaveAtLeastOneLine {
    if (
      this.status === OrderStatus.Canceled ||
      this.status === OrderStatus.Shipped
    ) {
      return new OrderLineCannotBeModified(this.status);
    }

    const newLines = this.lines.filter((l) => l.identifier !== lineIdentifier);

    if (newLines.length === 0) {
      return new OrderMustHaveAtLeastOneLine();
    }

    return new Order(
      this.identifier,
      newLines,
      this.status,
      new Date(),
      this.createdAt
    );
  }

  public updateLine(
    lineIdentifier: string,
    newQuantity: number
  ): Order | OrderLineCannotBeModified | InvalidQuantity {
    if (
      this.status === OrderStatus.Canceled ||
      this.status === OrderStatus.Shipped
    ) {
      return new OrderLineCannotBeModified(this.status);
    }

    if (newQuantity <= 0) {
      return new InvalidQuantity(newQuantity);
    }

    const lineIndex = this.lines.findIndex(
      (l) => l.identifier === lineIdentifier
    );

    if (lineIndex === -1) {
      return this;
    }

    const updatedLine = this.lines[lineIndex].updateQuantity(newQuantity);

    if (updatedLine instanceof InvalidQuantity) {
      return updatedLine;
    }

    const newLines = [...this.lines];
    newLines[lineIndex] = updatedLine;

    return new Order(
      this.identifier,
      newLines,
      this.status,
      new Date(),
      this.createdAt
    );
  }

  public updateStatus(newStatus: OrderStatus): Order | InvalidStatusTransition {
    const statusOrder = [
      OrderStatus.Pending,
      OrderStatus.Paid,
      OrderStatus.Shipped,
    ];
    const currentIndex = statusOrder.indexOf(this.status);
    const newIndex = statusOrder.indexOf(newStatus);

    if (
      this.status === OrderStatus.Canceled ||
      newStatus === OrderStatus.Canceled
    ) {
      return new Order(
        this.identifier,
        this.lines,
        newStatus,
        new Date(),
        this.createdAt
      );
    }

    if (newIndex < currentIndex) {
      return new InvalidStatusTransition(this.status, newStatus);
    }

    return new Order(
      this.identifier,
      this.lines,
      newStatus,
      new Date(),
      this.createdAt
    );
  }
}
