import BillController from "@/controllers/BillController";
import { asyncHandler } from "@/middleware/asyncHandler";
import express from "express";

const billRoute = express.Router();

billRoute.post(BillController.createSlug, asyncHandler(BillController.create));

billRoute.get(BillController.listSlug, asyncHandler(BillController.list));

billRoute.get(BillController.detailSlug, asyncHandler(BillController.detail));

export default billRoute;
