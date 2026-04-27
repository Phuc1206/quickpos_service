import { ICreate, IList } from "@/controllers/BillController/type";
import Bill from "@/database/Bill";
import Customer from "@/database/Customer";
import Employee from "@/database/Employee";
import MenuItem from "@/database/MenuItem";
import { generateBillCode } from "@/services/bill.service";
import { ApiResponse } from "@/utils/ApiResponse";
import pagination from "@/utils/pagination";
import { Request, Response } from "express";

export const createSlug: string = "/";
export const create: any = async (req: Request, res: Response) => {
  const { customerId, customer, items, paymentMethod, cashReceived, finalAmount } =
    req.body as ICreate;
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
    employeeId: req.token.userId,
    items: orderItems,
    totalQuantity,
    totalAmount,
    finalAmount,
    paymentMethod,
    cashReceived
  });
  const employee = await Employee.findById(req.token.userId).select("name");

  const result = {
    ...bill.toObject(),
    employeeName: employee?.name || null
  };
  if (!bill) return ApiResponse.error(res, 400, "Tạo hóa đơn thất bại");
  return ApiResponse.success(res, 201, "Tạo hóa đơn thành công", result);
};

export const detailSlug: string = "/detail/:id";
export const detail: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const bill = await Bill.findById(id).lean().populate("employeeId", "name");
  if (!bill) return ApiResponse.error(res, 400, "Lấy hóa đơn thất bại");
  return ApiResponse.success(res, 200, "Lấy hóa đơn thành công", bill);
};

export const listSlug: string = "/list";
export const list: any = async (req: Request, res: Response) => {
  const { page, rows, search, from, to } = req.query as unknown as IList;
  const { skip, limit } = pagination(rows, page);
  const fromDate = new Date(from);
  const toDate = new Date(to);
  let filter: any = { isDelete: false };
  if (from && to) {
    filter = { ...filter, createdAt: { $gte: fromDate, $lte: toDate } };
  }
  if (search) filter = { ...filter, code: { $regex: search, $options: "i" } };

  const bills = await Bill.find({
    ...filter
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
  const count = await Bill.find({ ...filter }).countDocuments();
  if (!bills) return ApiResponse.error(res, 400, "Lấy danh sách hóa đơn thất bại");
  return ApiResponse.success(res, 200, "Lấy danh sách hóa đơn thành công", { bills, count });
};
