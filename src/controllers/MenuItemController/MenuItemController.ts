import MenuItem from "@/database/MenuItem";
import { CloudinaryService } from "@/services";
import { deleteImage } from "@/services/cloudinary.service";
import { ApiResponse } from "@/utils/ApiResponse";
import pagination from "@/utils/pagination";
import { Request, Response } from "express";

export const createSlug: string = "/";
export const create: any = async (req: Request, res: Response) => {
  const { name, price } = req.body;
  const file = req.file as Express.Multer.File;

  let imageUrl = "";
  let publicId = "";
  if (file) {
    const result: any = await CloudinaryService.uploadImage(req.file as Express.Multer.File);

    imageUrl = result.secure_url;
    publicId = result.public_id;
  }
  const item = await MenuItem.create({
    name,
    price,
    image: imageUrl,
    publicId
  });
  if (!item) return ApiResponse.error(res, 400, "Tạo thực đơn thất bại");
  return ApiResponse.success(res, 201, "Tạo thực đơn thành cong", item);
};

export const listSlug: string = "/list";
export const list: any = async (req: Request, res: Response) => {
  const { page, rows, search } = req.query;
  const { skip, limit } = pagination(rows, page);
  const menuItems = await MenuItem.find({
    isDelete: false,
    name: { $regex: search, $options: "i" }
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
  const count = await MenuItem.find({
    isDelete: false,
    name: { $regex: search, $options: "i" }
  }).countDocuments();
  if (!menuItems) return ApiResponse.error(res, 400, "Lấy danh sách thực đơn thất bại");
  return ApiResponse.success(res, 200, "Lấy danh sách thực đơn thành công", { menuItems, count });
};

export const detailSlug: string = "/detail/:id";
export const detail: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const menuItem = await MenuItem.findById(id).lean();
  if (!menuItem) return ApiResponse.error(res, 400, "Lấy thực đơn thất bại");
  return ApiResponse.success(res, 200, "Lấy thực đơn thành công", menuItem);
};

export const updateSlug: string = "/:id";
export const update: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, price } = req.body;
  const file = req.file as Express.Multer.File;

  const updateData: any = {
    name,
    price
  };

  if (file) {
    const menuItem = await MenuItem.findById(id).lean();
    if (!menuItem) return ApiResponse.error(res, 400, "Không tìm thấy thực đơn");

    const result: any = await CloudinaryService.uploadImage(file);

    updateData.image = result.secure_url;
    updateData.publicId = result.public_id;

    // xoá ảnh cũ
    if (menuItem.publicId) {
      await deleteImage(menuItem.publicId);
    }
  }

  const menuItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });

  if (!menuItem) return ApiResponse.error(res, 400, "Cập nhật thực đơn thất bại");

  return ApiResponse.success(res, 200, "Cập nhật thực đơn thành công", menuItem);
};

export const removeSlug: string = "/:id";
export const remove: any = async (req: Request, res: Response) => {
  const { id } = req.params;
  const menuItem = await MenuItem.findByIdAndUpdate(id, { isDelete: true }, { new: true });
  if (!menuItem) return ApiResponse.error(res, 400, "Xóa thực đơn thất bại");
  return ApiResponse.success(res, 200, "Xóa thực đơn thành cong", menuItem);
};

export const selectionSlug: string = "/selection";
export const selection: any = async (req: Request, res: Response) => {
  const menuItems = await MenuItem.find({ isDelete: false }, { name: 1, _id: 1, createdAt: 1 })
    .sort({ createdAt: -1 })
    .lean();
  if (!menuItems) return ApiResponse.error(res, 400, "Lấy danh sách thực đơn thất bại");
  return ApiResponse.success(res, 200, "Lấy danh sách thực đơn thành cong", menuItems);
};
