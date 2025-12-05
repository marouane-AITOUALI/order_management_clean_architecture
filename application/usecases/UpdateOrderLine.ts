import { Usecase } from "./Usecase";
import { UpdateOrderLineRequest } from "../requests/UpdateOrderLineRequest";
import { UpdateOrderLineResponse } from "../responses/UpdateOrderLineResponse";
import { OrderRepository } from "../repositories/OrderRepository";

export class UpdateOrderLine
  implements Usecase<UpdateOrderLineRequest, UpdateOrderLineResponse>
{
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(
    request: UpdateOrderLineRequest
  ): Promise<UpdateOrderLineResponse> {
    const order = await this.orderRepository.findById(request.orderId);

    if (order instanceof Error) {
      return order;
    }

    const updatedOrder = order.updateLine(request.lineId, request.quantity);

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
