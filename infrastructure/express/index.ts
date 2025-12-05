import express from "express";
import bodyParser from "express";
import { PlaceOrder } from "../../application/usecases/PlaceOrder";
import { CancelOrder } from "../../application/usecases/CancelOrder";
import { AddOrderLine } from "../../application/usecases/AddOrderLine";
import { UpdateOrderLine } from "../../application/usecases/UpdateOrderLine";
import { RemoveOrderLine } from "../../application/usecases/RemoveOrderLine";
import { GetOrder } from "../../application/usecases/GetOrder";
import { ListOrders } from "../../application/usecases/ListOrders";
import { NodeIdentifierGenerator } from "../adapters/services/NodeIdentifierGenerator";
import { MemoryOrderRepository } from "../adapters/repositories/MemoryOrderRepository";

const server = express();
server.use(bodyParser.json());

const identifierGenerator = new NodeIdentifierGenerator();
const orderRepository = new MemoryOrderRepository();

server.post("/orders", async (request, response) => {
  const placeOrder = new PlaceOrder(identifierGenerator, orderRepository);
  const result = await placeOrder.execute(request.body);

  if (result instanceof Error) {
    response.status(400).json({ error: result.name });
    return;
  }

  response.status(201).json({
    orderId: result.identifier.value,
    status: result.status,
    totalAmount: result.totalAmount,
    lines: result.lines.map((l) => ({
      id: l.identifier,
      productId: l.productId,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      totalAmount: l.totalAmount,
    })),
  });
});

server.get("/orders", async (_, response) => {
  const listOrders = new ListOrders(orderRepository);
  const orders = await listOrders.execute({});

  response.json({
    orders: orders.map((o) => ({
      orderId: o.identifier.value,
      status: o.status,
      totalAmount: o.totalAmount,
      linesCount: o.lines.length,
    })),
  });
});

server.get("/orders/:orderId", async (request, response) => {
  const getOrder = new GetOrder(orderRepository);
  const result = await getOrder.execute({ orderId: request.params.orderId });

  if (result instanceof Error) {
    response.status(404).json({ error: result.name });
    return;
  }

  response.json({
    orderId: result.identifier.value,
    status: result.status,
    totalAmount: result.totalAmount,
    lines: result.lines.map((l) => ({
      id: l.identifier,
      productId: l.productId,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      totalAmount: l.totalAmount,
    })),
  });
});

server.post("/orders/:orderId/cancel", async (request, response) => {
  const cancelOrder = new CancelOrder(orderRepository);
  const result = await cancelOrder.execute({ orderId: request.params.orderId });

  if (result instanceof Error) {
    response.status(400).json({ error: result.name });
    return;
  }

  response.json({
    orderId: result.identifier.value,
    status: result.status,
  });
});

server.post("/orders/:orderId/lines", async (request, response) => {
  const addOrderLine = new AddOrderLine(orderRepository);
  const result = await addOrderLine.execute({
    orderId: request.params.orderId,
    ...request.body,
  });

  if (result instanceof Error) {
    response.status(400).json({ error: result.name });
    return;
  }

  response.json({
    orderId: result.identifier.value,
    totalAmount: result.totalAmount,
    lines: result.lines.map((l) => ({
      id: l.identifier,
      productId: l.productId,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      totalAmount: l.totalAmount,
    })),
  });
});

server.put("/orders/:orderId/lines/:lineId", async (request, response) => {
  const updateOrderLine = new UpdateOrderLine(orderRepository);
  const result = await updateOrderLine.execute({
    orderId: request.params.orderId,
    lineId: request.params.lineId,
    quantity: request.body.quantity,
  });

  if (result instanceof Error) {
    response.status(400).json({ error: result.name });
    return;
  }

  response.json({
    orderId: result.identifier.value,
    totalAmount: result.totalAmount,
  });
});

server.delete("/orders/:orderId/lines/:lineId", async (request, response) => {
  const removeOrderLine = new RemoveOrderLine(orderRepository);
  const result = await removeOrderLine.execute({
    orderId: request.params.orderId,
    lineId: request.params.lineId,
  });

  if (result instanceof Error) {
    response.status(400).json({ error: result.name });
    return;
  }

  response.json({
    orderId: result.identifier.value,
    totalAmount: result.totalAmount,
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("Order API listening on port 3000...");
});
