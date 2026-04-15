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

export default menuItemRoute;
