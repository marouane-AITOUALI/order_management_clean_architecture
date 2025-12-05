import { Usecase } from "./Usecase";
import { RemoveOrderLineRequest } from "../requests/RemoveOrderLineRequest";
import { RemoveOrderLineResponse } from "../responses/RemoveOrderLineResponse";
import { OrderRepository } from "../repositories/OrderRepository";

export class RemoveOrderLine
  implements Usecase<RemoveOrderLineRequest, RemoveOrderLineResponse>
{
  public constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(
    request: RemoveOrderLineRequest
  ): Promise<RemoveOrderLineResponse> {
    const order = await this.orderRepository.findById(request.orderId);

    if (order instanceof Error) {
      return order;
    }

    const updatedOrder = order.removeLine(request.lineId);

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
