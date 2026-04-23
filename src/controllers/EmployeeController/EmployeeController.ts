import Employee from "@/database/Employee";
import { ELevel } from "@/types/enum";
import { ApiResponse } from "@/utils/ApiResponse";
import pagination from "@/utils/pagination";
import { Request, Response } from "express";

export const createSlug: string = "/";
export const create: any = async (req: Request, res: Response) => {
  const { name, phoneNumber, address } = req.body;
  if (phoneNumber) {
    const existingCustomer = await Employee.findOne({ phoneNumber });
    if (existingCustomer) return ApiResponse.error(res, 400, "Số điện thoại đã được sử dụng");
  }

  const customer = await Employee.create({ name, phoneNumber, address, level: ELevel.EMPLOYEE });
  if (!customer) return ApiResponse.error(res, 400, "Tạo nhân viên thất bại");
  return ApiResponse.success(res, 201, "Tạo nhân viên thành công", customer);
};

export const updateSlug: string = "/:id";
export const update: any = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { name, phoneNumber, address } = req.body;
  const existingEmployee = await Employee.findOne({ _id: { $ne: id }, phoneNumber });
  if (existingEmployee) return ApiResponse.error(res, 400, "Số điện thoại đã được sử dụng");
  const customer = await Employee.findByIdAndUpdate(
    id,
    { name, phoneNumber, address },
    { new: true }
  );
  if (!customer) return ApiResponse.error(res, 400, "Cập nhật nhân viên thất bại");
  return ApiResponse.success(res, 200, "Cập nhật nhân viên thành công", customer);
};

export const removeSlug: string = "/:id";
export const remove: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const employee = await Employee.findByIdAndUpdate(id, { isDelete: true }, { new: true });
  if (!employee) return ApiResponse.error(res, 400, "Xóa nhân viên thất bại");
  return ApiResponse.success(res, 200, "Xóa nhân viên thành công", employee);
};

export const detailSlug: string = "/detail/:id";
export const detail: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const employee = await Employee.findById(id).lean();
  if (!employee) return ApiResponse.error(res, 400, "Lấy nhân viên thất bại");
  return ApiResponse.success(res, 200, "Lấy nhân viên thành công", employee);
};

export const listSlug: string = "/list";
export const list: any = async (req: Request, res: Response) => {
  const { page, rows, search } = req.query;
  const { skip, limit } = pagination(rows, page);
  const employees = await Employee.find({
    isDelete: false,
    name: { $regex: search, $options: "i" }
  })
    .skip(skip)
    .limit(limit);
  if (!employees) return ApiResponse.error(res, 400, "Lấy danh sách nhân viên thất bại");
  return ApiResponse.success(res, 200, "Lấy danh sách nhân viên thành công", employees);
};
