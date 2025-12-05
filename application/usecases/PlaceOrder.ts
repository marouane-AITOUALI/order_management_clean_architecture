import { PlaceOrderRequest } from "../requests/PlaceOrderRequest";
import { PlaceOrderResponse } from "../responses/PlaceOrderResponse";
import { Usecase } from "./Usecase";
import { IdentifierGenerator } from "../services/IdentifierGenerator";
import { OrderRepository } from "../repositories/OrderRepository";
import { Order } from "../../domain/entities/Order";
import { OrderLine } from "../../domain/entities/OrderLine";
import { OrderStatus } from "../../domain/enumerations/OrderStatus";
import { InvalidQuantity } from "../../domain/errors/InvalidQuantity";

export class PlaceOrder
  implements Usecase<PlaceOrderRequest, PlaceOrderResponse>
{
  public constructor(
    private readonly identifierGenerator: IdentifierGenerator,
    private readonly orderRepository: OrderRepository
  ) {}

  public async execute(
    request: PlaceOrderRequest
  ): Promise<PlaceOrderResponse> {
    const identifier = this.identifierGenerator.create();

    if (identifier instanceof Error) {
      return identifier;
    }

    const lines = request.lines.map((line, index) => {
      if (line.quantity <= 0) {
        return new InvalidQuantity(line.quantity);
      }

      return new OrderLine(
        `LINE-${index + 1}`,
        line.productId,
        line.quantity,
        line.unitPrice,
        new Date(),
        new Date()
      );
    });

    const error = lines.find((l) => l instanceof Error);
    if (error) {
      return error as Error;
    }

    const order = new Order(
      identifier,
      lines as OrderLine[],
      OrderStatus.Pending,
      new Date(),
      new Date()
    );

    const saveResult = await this.orderRepository.create(order);

    if (saveResult) {
      return saveResult;
    }

    return order;
  }
}
