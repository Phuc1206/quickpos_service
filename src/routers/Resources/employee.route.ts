import EmployeeController from "@/controllers/EmployeeController";
import { asyncHandler } from "@/middleware/asyncHandler";
import express from "express";

const employeeRoute = express.Router();

employeeRoute.post(EmployeeController.createSlug, asyncHandler(EmployeeController.create));

employeeRoute.patch(EmployeeController.updateSlug, asyncHandler(EmployeeController.update));

employeeRoute.get(EmployeeController.detailSlug, asyncHandler(EmployeeController.detail));

employeeRoute.delete(EmployeeController.removeSlug, asyncHandler(EmployeeController.remove));

employeeRoute.get(EmployeeController.listSlug, asyncHandler(EmployeeController.list));

export default employeeRoute;
