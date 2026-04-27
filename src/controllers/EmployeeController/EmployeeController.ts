import Employee from "@/database/Employee";
import { ELevel } from "@/types/enum";
import { ApiResponse } from "@/utils/ApiResponse";
import pagination from "@/utils/pagination";
import { Request, Response } from "express";

export const createSlug: string = "/";
export const create: any = async (req: Request, res: Response) => {
  const { name, phoneNumber, address } = req.body;

  const cleanedPhone = phoneNumber?.trim();

  if (cleanedPhone) {
    const existingCustomer = await Employee.findOne({ phoneNumber: cleanedPhone });
    if (existingCustomer) {
      return ApiResponse.error(res, 400, "Số điện thoại đã được sử dụng");
    }
  }

  const payload: any = {
    name,
    address,
    level: ELevel.EMPLOYEE
  };

  if (cleanedPhone) {
    payload.phoneNumber = cleanedPhone;
  }

  const customer = await Employee.create(payload);

  return ApiResponse.success(res, 201, "Tạo nhân viên thành công", customer);
};

export const updateSlug: string = "/:id";
export const update: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, phoneNumber, address } = req.body;

  // chuẩn hóa phone
  const cleanedPhone = phoneNumber?.trim();

  // chỉ check khi có phone hợp lệ
  if (cleanedPhone) {
    const existingEmployee = await Employee.findOne({
      _id: { $ne: id },
      phoneNumber: cleanedPhone
    });

    if (existingEmployee) {
      return ApiResponse.error(res, 400, "Số điện thoại đã được sử dụng");
    }
  }

  // payload sạch
  const payload: any = {
    name,
    address
  };

  if (cleanedPhone) {
    payload.phoneNumber = cleanedPhone;
  } else {
    // nếu xoá số điện thoại
    payload.$unset = { phoneNumber: "" };
  }

  const employee = await Employee.findByIdAndUpdate(id, payload, { new: true });

  if (!employee) {
    return ApiResponse.error(res, 400, "Cập nhật nhân viên thất bại");
  }

  return ApiResponse.success(res, 200, "Cập nhật nhân viên thành công", employee);
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
    $or: [
      { name: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } }
    ]
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const count = await Employee.find({
    isDelete: false,
    $or: [
      { name: { $regex: search, $options: "i" } },
      { phoneNumber: { $regex: search, $options: "i" } }
    ]
  }).countDocuments();
  if (!employees) return ApiResponse.error(res, 400, "Lấy danh sách nhân viên thất bại");
  return ApiResponse.success(res, 200, "Lấy danh sách nhân viên thành công", { employees, count });
};
