export interface ICreate {
  customer: {
    customerId: string | null;
    name: string;
    phoneNumber: string;
    address: string;
  };

  items: Array<{
    menuItemId: string;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    total: number;
  }>;
  totalQuantity: number;
  totalAmount: number;
  finalAmount: number;
  paymentMethod: string;
  cashReceived: number;
}
