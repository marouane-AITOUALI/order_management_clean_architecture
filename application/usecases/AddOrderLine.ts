import { Usecase } from "./Usecase";
import { AddOrderLineRequest } from "../requests/AddOrderLineRequest";
import { AddOrderLineResponse } from "../responses/AddOrderLineResponse";
import { OrderRepository } from "../repositories/OrderRepository";
import { OrderLine } from "../../domain/entities/OrderLine";

export class AddOrderLine
  implements Usecase<AddOrderLineRequest, AddOrderLineResponse>
{
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(
    request: AddOrderLineRequest
  ): Promise<AddOrderLineResponse> {
    const order = await this.orderRepository.findById(request.orderId);

    if (order instanceof Error) {
      return order;
    }

    const newLine = new OrderLine(
      `LINE-${Date.now()}`,
      request.productId,
      request.quantity,
      request.unitPrice,
      new Date(),
      new Date()
    );

    const updatedOrder = order.addLine(newLine);

    if (updatedOrder instanceof Error) {
      return updatedOrder;
    }

    const saveResult = await this.orderRepository.update(updatedOrder);

    if (saveResult) {
      return saveResult;
    }

    return updatedOrder;
  }
}
