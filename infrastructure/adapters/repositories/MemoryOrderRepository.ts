import { OrderSaveFailed } from "../../../application/errors/OrderSaveFailed";
import { OrderNotFound } from "../../../application/errors/OrderNotFound";
import { OrderRepository } from "../../../application/repositories/OrderRepository";
import { Order } from "../../../domain/entities/Order";

export class MemoryOrderRepository implements OrderRepository {
  public constructor(private readonly orders: Map<string, Order> = new Map()) {}

  public async allOrders(): Promise<Order[]> {
    return [...this.orders.values()];
  }

  public async create(order: Order): Promise<null | OrderSaveFailed> {
    if (this.orders.has(order.identifier.value)) {
      return new OrderSaveFailed("Already added");
    }

    this.orders.set(order.identifier.value, order);

    return null;
  }

  public async update(order: Order): Promise<null | OrderSaveFailed> {
    if (!this.orders.has(order.identifier.value)) {
      return new OrderSaveFailed("Order not found");
    }

    this.orders.set(order.identifier.value, order);

    return null;
  }

  public async findById(orderId: string): Promise<Order | OrderNotFound> {
    const order = this.orders.get(orderId);

    if (!order) {
      return new OrderNotFound(orderId);
    }

    return order;
  }
}
