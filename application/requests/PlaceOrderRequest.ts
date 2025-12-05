export interface PlaceOrderRequest {
  readonly lines: {
    readonly productId: string;
    readonly quantity: number;
    readonly unitPrice: number;
  }[];
}
