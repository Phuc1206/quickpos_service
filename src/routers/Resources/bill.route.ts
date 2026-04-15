import BillController from "@/controllers/BillController";
import { asyncHandler } from "@/middleware/asyncHandler";
import uploadMemory from "@/middleware/uploadMemory";
import express from "express";

const billRoute = express.Router();

billRoute.post(
  BillController.createSlug,

  asyncHandler(BillController.create)
);

export default billRoute;
