import EmployeeController from "@/controllers/EmployeeController";
import { asyncHandler } from "@/middleware/asyncHandler";
import validateRequest from "@/middleware/validateRequest";
import { ELevel } from "@/types/enum";
import { checkPermissionByLevel } from "@/utils/checkPermissionByLevel";
import express from "express";

const employeeRoute = express.Router();

employeeRoute.post(
  EmployeeController.createSlug,
  checkPermissionByLevel([ELevel.ADMIN]),
  validateRequest,
  asyncHandler(EmployeeController.create)
);

employeeRoute.patch(
  EmployeeController.updateSlug,
  checkPermissionByLevel([ELevel.ADMIN]),
  validateRequest,
  asyncHandler(EmployeeController.update)
);

employeeRoute.get(
  EmployeeController.detailSlug,
  checkPermissionByLevel([ELevel.ADMIN]),
  validateRequest,
  asyncHandler(EmployeeController.detail)
);

employeeRoute.delete(
  EmployeeController.removeSlug,
  checkPermissionByLevel([ELevel.ADMIN]),
  asyncHandler(EmployeeController.remove)
);

employeeRoute.get(
  EmployeeController.listSlug,
  checkPermissionByLevel([ELevel.ADMIN]),
  asyncHandler(EmployeeController.list)
);

export default employeeRoute;
