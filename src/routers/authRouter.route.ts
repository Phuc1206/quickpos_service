import AuthenticationController from "@/controllers/AuthenicationController";
import { asyncHandler } from "@/middleware/asyncHandler";
import authenticateToken from "@/middleware/authenticateToken";
import validateRequest from "@/middleware/validateRequest";
import express from "express";
import { body } from "express-validator";

const authRouter = express.Router();

const validateFormCreate = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required")
];

authRouter.post(
  AuthenticationController.signInSlug,
  validateFormCreate,
  validateRequest,
  asyncHandler(AuthenticationController.signIn)
);

authRouter.post(
  AuthenticationController.refreshTokenSlug,
  asyncHandler(AuthenticationController.refreshToken)
);

authRouter.post(
  AuthenticationController.signOutSlug,
  authenticateToken,
  asyncHandler(AuthenticationController.signOut)
);

export default authRouter;
