import AuthenticationController from "@/controllers/AuthenicationController";
import { asyncHandler } from "@/middleware/asyncHandler";
import express from "express";

const authRouter = express.Router();

authRouter.post(AuthenticationController.signInSlug, asyncHandler(AuthenticationController.signIn));

authRouter.post(
  AuthenticationController.refreshTokenSlug,
  asyncHandler(AuthenticationController.refreshToken)
);

authRouter.post(
  AuthenticationController.signOutSlug,
  asyncHandler(AuthenticationController.signOut)
);

export default authRouter;
