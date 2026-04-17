import { ICreate } from "@/controllers/BillController/type";
import Bill from "@/database/Bill";
import Customer from "@/database/Customer";
import MenuItem from "@/database/MenuItem";
import { generateBillCode } from "@/services/bill.service";
import { ApiResponse } from "@/utils/ApiResponse";
import { Request, Response } from "express";

export const createSlug: string = "/";
export const create: any = async (req: Request, res: Response) => {
  const { customerId, customer, items, paymentMethod, cashReceived } = req.body as ICreate;
  if (!items || !items.length) return ApiResponse.error(res, 400, "Items là bắt buộc");
  const itemIds = items.map((i) => i.menuItemId);
  const menuItems = await MenuItem.find({
    _id: { $in: itemIds }
  });
  if (!menuItems) return ApiResponse.error(res, 400, "Không tìm thấy thực đơn");
  const orderItems = items.map((item) => {
    const menu = menuItems.find((m) => m._id.toString() === item.menuItemId);
    if (!menu) throw new Error("Không tìm thấy thực đơn");
    const total = menu.price * item.quantity;

    return {
      menuItemId: menu._id,
      name: menu.name,
      price: menu.price,
      quantity: item.quantity,
      discount: 0,
      total
    };
  });

  let customerData = null;
  const totalQuantity = orderItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalAmount = orderItems.reduce((sum, i) => sum + i.total, 0);
  if (customerId) {
    const cus = await Customer.findById(customerId);
    if (cus) {
      customerData = {
        customerId: cus._id,
        name: cus.name,
        phoneNumber: cus.phoneNumber,
        address: cus.address
      };
    }
  } else if (customer) {
    customerData = customer;
  }
  const code = await generateBillCode();
  const bill = await Bill.create({
    code: code,
    customer: customerData,
    items: orderItems,
    totalQuantity,
    totalAmount,
    finalAmount: totalAmount,
    paymentMethod,
    cashReceived
  });

  if (!bill) return ApiResponse.error(res, 400, "Tạo hóa đơn thất bại");
  return ApiResponse.success(res, 201, "Tạo hóa đơn thành công", bill);
};
