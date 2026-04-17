import { EPaymentMethod } from "@/types/enum";

export interface ICreate {
  customerId?: string;
  customer?: {
    name: string;
    phoneNumber: string;
    address: string;
  };
  items: {
    menuItemId: string;
    quantity: number;
  }[];
  paymentMethod: EPaymentMethod;
  cashReceived: number;
}
