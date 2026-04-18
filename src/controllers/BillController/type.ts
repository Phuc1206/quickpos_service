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
  finalAmount: number;
}

export interface IList {
  page: number;
  rows: number;
  search: string;
  from: string;
  to: string;
}
