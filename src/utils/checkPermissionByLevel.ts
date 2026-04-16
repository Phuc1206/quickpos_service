import { NextFunction } from "express";
import { Request, Response } from "express";
import { throwError } from "./ApiResponse";

export const checkPermissionByLevel = (allowedLevels: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userLevel = req.token?.level;

    if (!userLevel) {
      return throwError(401, "Bạn chưa đăng nhập hoặc token không hợp lệ.");
    }

    if (allowedLevels.includes(userLevel)) {
      next();
    } else {
      throwError(403, "Bạn không có quyền thực hiện chức năng này.");
    }
  };
};
