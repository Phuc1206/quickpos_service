import CustomerController from "@/controllers/CustomerController";
import { asyncHandler } from "@/middleware/asyncHandler";
import express from "express";

const customerRoute = express.Router();

customerRoute.get(CustomerController.detailSlug, asyncHandler(CustomerController.detail));

customerRoute.get(CustomerController.listSlug, asyncHandler(CustomerController.list));

customerRoute.post(CustomerController.createSlug, asyncHandler(CustomerController.create));

customerRoute.patch(CustomerController.updateSlug, asyncHandler(CustomerController.update));

customerRoute.delete(CustomerController.removeSlug, asyncHandler(CustomerController.remove));

customerRoute.get(CustomerController.selectionSlug, asyncHandler(CustomerController.selection));

export default customerRoute;
