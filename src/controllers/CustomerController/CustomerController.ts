import Customer from "@/database/Customer";
import { ApiResponse } from "@/utils/ApiResponse";
import pagination from "@/utils/pagination";
import { Request, Response } from "express";

export const createSlug: string = "/";
export const create: any = async (req: Request, res: Response) => {
  const { name, phoneNumber, address } = req.body;
  const existingCustomer = await Customer.findOne({ phoneNumber });
  if (existingCustomer) return ApiResponse.error(res, 400, "Số điện thoại đã được sử dụng");
  const customer = await Customer.create({ name, phoneNumber, address });
  if (!customer) return ApiResponse.error(res, 400, "Tạo khách hàng thất bại");
  return ApiResponse.success(res, 201, "Tạo khách hàng thành công", customer);
};

export const listSlug: string = "/list";
export const list: any = async (req: Request, res: Response) => {
  const { page, rows } = req.query;
  const { skip, limit } = pagination(rows, page);
  const customers = await Customer.find({ isDelete: false }).skip(skip).limit(limit);
  if (!customers) return ApiResponse.error(res, 400, "Lấy danh sách khách hàng thất bại");
  return ApiResponse.success(res, 200, "Lấy danh sách khách hàng thành công", customers);
};

export const detailSlug: string = "/detail/:id";
export const detail: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await Customer.findById(id).lean();
  if (!customer) return ApiResponse.error(res, 400, "Lấy khách hàng thất bại");
  return ApiResponse.success(res, 200, "Lấy khách hàng thành cong", customer);
};

export const updateSlug: string = "/:id";
export const update: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phoneNumber, address } = req.body;
  const existingCustomer = await Customer.findOne({ _id: { $ne: id }, phoneNumber });
  if (existingCustomer) return ApiResponse.error(res, 400, "Số điện thoại đã được sử dụng");
  const customer = await Customer.findByIdAndUpdate(
    id,
    { name, phoneNumber, address },
    { new: true }
  );
  if (!customer) return ApiResponse.error(res, 400, "Cập nhật khách hàng thất bại");
  return ApiResponse.success(res, 200, "Cập nhật khách hàng thành cong", customer);
};

export const removeSlug: string = "/:id";
export const remove: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const customer = await Customer.findByIdAndUpdate(id, { isDelete: true }, { new: true });
  if (!customer) return ApiResponse.error(res, 400, "Xóa khách hàng thất bại");
  return ApiResponse.success(res, 200, "Xóa khách hàng thành công", customer);
};
