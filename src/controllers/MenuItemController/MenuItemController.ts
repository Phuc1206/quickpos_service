import MenuItem from "@/database/MenuItem";
import { CloudinaryService } from "@/services";
import { ApiResponse } from "@/utils/ApiResponse";
import pagination from "@/utils/pagination";
import { Request, Response } from "express";

export const createSlug: string = "/";
export const create: any = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  const file = req.file as Express.Multer.File;

  let imageUrl = "";
  if (file) {
    const result: any = await CloudinaryService.uploadImage(req.file as Express.Multer.File);
    imageUrl = result.secure_url;
  }
  const item = await MenuItem.create({
    name,
    price,
    image: imageUrl
  });
  if (!item) return ApiResponse.error(res, 400, "Tạo menu thất bại");
  return ApiResponse.success(res, 201, "Tạo menu thành cong", item);
};

export const listSlug: string = "/list";
export const list: any = async (req: Request, res: Response) => {
  const { page, rows } = req.query;
  const { skip, limit } = pagination(rows, page);
  const menuItems = await MenuItem.find({ isDelete: false }).skip(skip).limit(limit);
  if (!menuItems) return ApiResponse.error(res, 400, "Lấy danh sách Menu thất bại");
  return ApiResponse.success(res, 200, "Lấy danh sách Menu thành công", menuItems);
};

export const detailSlug: string = "/detail";
export const detail: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const menuItem = await MenuItem.findById(id).lean();
  if (!menuItem) return ApiResponse.error(res, 400, "Lấy menu thất bại");
  return ApiResponse.success(res, 200, "Lấy menu thành công", menuItem);
};

export const updateSlug: string = "/";
export const update: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const menuItem = await MenuItem.findByIdAndUpdate(id, { name, price }, { new: true });
  if (!menuItem) return ApiResponse.error(res, 400, "Cập nhật menu thất bại");
  return ApiResponse.success(res, 200, "Cập nhật menu thành cong", menuItem);
};

export const removeSlug: string = "/";
export const remove: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const menuItem = await MenuItem.findByIdAndUpdate(id, { isDelete: true }, { new: true });
  if (!menuItem) return ApiResponse.error(res, 400, "Xóa menu thất bại");
  return ApiResponse.success(res, 200, "Xóa menu thành cong", menuItem);
};
