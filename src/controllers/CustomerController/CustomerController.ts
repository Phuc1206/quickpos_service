import Bill from "@/database/Bill";
import Customer from "@/database/Customer";
import { ApiResponse } from "@/utils/ApiResponse";
import pagination from "@/utils/pagination";
import { Request, Response } from "express";

export const createSlug: string = "/";
export const create: any = async (req: Request, res: Response) => {
  const { name, phoneNumber, address } = req.body;
  // chuẩn hóa dữ liệu
  const cleanedPhone = phoneNumber?.trim();

  // check trùng khi có phone hợp lệ
  if (cleanedPhone) {
    const existingCustomer = await Customer.findOne({ phoneNumber: cleanedPhone });
    if (existingCustomer) {
      return ApiResponse.error(res, 400, "Số điện thoại đã được sử dụng");
    }
  }

  // tạo payload sạch (không lưu "")
  const payload: any = { name, address };
  if (cleanedPhone) {
    payload.phoneNumber = cleanedPhone;
  }

  const customer = await Customer.create(payload);

  return ApiResponse.success(res, 201, "Tạo khách hàng thành công", customer);
};

export const listSlug: string = "/list";
export const list: any = async (req: Request, res: Response) => {
  const { page, rows, search } = req.query;
  const { skip, limit } = pagination(rows, page);
  const customers = await Customer.find({
    isDelete: false,
    $or: [
      { name: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } }
    ]
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const count = await Customer.find({
    isDelete: false,
    $or: [
      { name: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } }
    ]
  }).countDocuments();
  if (!customers) return ApiResponse.error(res, 400, "Lấy danh sách khách hàng thất bại");
  return ApiResponse.success(res, 200, "Lấy danh sách khách hàng thành công", { customers, count });
};

export const detailSlug: string = "/detail/:id";
export const detail: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await Customer.findById(id).lean();
  if (!customer) return ApiResponse.error(res, 400, "Lấy khách hàng thất bại");
  const bills = await Bill.find({
    "customer.customerId": id,
    isDelete: false
  })
    .sort({ createdAt: -1 })
    .lean();
  return ApiResponse.success(res, 200, "Lấy khách hàng thành cong", { customer, bills });
};

export const updateSlug: string = "/:id";
export const update: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phoneNumber, address } = req.body;

  const cleanedPhone = phoneNumber?.trim();

  // chỉ check trùng khi có phone hợp lệ
  if (cleanedPhone) {
    const existingCustomer = await Customer.findOne({
      _id: { $ne: id },
      phoneNumber: cleanedPhone
    });

    if (existingCustomer) {
      return ApiResponse.error(res, 400, "Số điện thoại đã được sử dụng");
    }
  }

  // tạo payload sạch
  const payload: any = { name, address };

  if (cleanedPhone) {
    payload.phoneNumber = cleanedPhone;
  } else {
    // nếu user xoá số điện thoại → remove khỏi DB
    payload.$unset = { phoneNumber: "" };
  }

  const customer = await Customer.findByIdAndUpdate(id, payload, { new: true });

  if (!customer) {
    return ApiResponse.error(res, 400, "Cập nhật khách hàng thất bại");
  }

  return ApiResponse.success(res, 200, "Cập nhật khách hàng thành công", customer);
};

export const removeSlug: string = "/:id";
export const remove: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await Customer.findByIdAndUpdate(id, { isDelete: true }, { new: true });
  if (!customer) return ApiResponse.error(res, 400, "Xóa khách hàng thất bại");
  return ApiResponse.success(res, 200, "Xóa khách hàng thành công", customer);
};

export const selectionSlug: string = "/selection";
export const selection: any = async (req: Request, res: Response) => {
  const customers = await Customer.find(
    { isDelete: false },
    { name: 1, phoneNumber: 1, _id: 1 }
  ).lean();
  if (!customers) return ApiResponse.error(res, 400, "Lấy danh sách khách hàng thất bại");
  return ApiResponse.success(res, 200, "Lấy danh sách khách hàng tion cong", customers);
};
