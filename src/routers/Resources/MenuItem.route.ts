import MenuItemController from "@/controllers/MenuItemController";
import { asyncHandler } from "@/middleware/asyncHandler";
import uploadMemory from "@/middleware/uploadMemory";
import express from "express";

const menuItemRoute = express.Router();

menuItemRoute.post(
  MenuItemController.createSlug,
  uploadMemory.single("image"),
  asyncHandler(MenuItemController.create)
);

menuItemRoute.get(MenuItemController.listSlug, asyncHandler(MenuItemController.list));

menuItemRoute.get(MenuItemController.detailSlug, asyncHandler(MenuItemController.detail));

menuItemRoute.patch(
  MenuItemController.updateSlug,
  uploadMemory.single("image"),
  asyncHandler(MenuItemController.update)
);

menuItemRoute.delete(MenuItemController.removeSlug, asyncHandler(MenuItemController.remove));

menuItemRoute.get(MenuItemController.selectionSlug, asyncHandler(MenuItemController.selection));

export default menuItemRoute;
