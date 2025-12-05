export interface UpdateOrderLineRequest {
  readonly orderId: string;
  readonly lineId: string;
  readonly quantity: number;
}
