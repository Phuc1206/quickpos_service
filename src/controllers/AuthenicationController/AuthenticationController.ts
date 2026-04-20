import ENV from "@/core/ENV";
import logger from "@/core/logger";
import IToken from "@/core/types/IToken";
import Employee from "@/database/Employee";
import RefreshToken from "@/database/RefreshToken";
import generate from "@/utils/generate";
import hashPassword from "@/utils/hashPassword";
import webToken from "@/utils/webToken";
import { Request, Response } from "express";

export const signInSlug: string = "/sign-in";
export const signIn: any = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    let userToSign: any = null;
    let tokenPayload: IToken;
    if (username === ENV.ADMIN_USER_NAME && password === ENV.ADMIN_PASSWORD) {
      userToSign = {
        userId: ENV.ADMIN_ID,
        name: ENV.ADMIN_NAME,
        username: ENV.ADMIN_USER_NAME,
        phoneNumber: ENV.ADMIN_PHONE_NUMBER,
        fullName: ENV.ADMIN_FULL_NAME,
        level: ENV.ADMIN_PERMISSION
      };
      tokenPayload = {
        userId: ENV.ADMIN_ID,
        level: ENV.ADMIN_PERMISSION
      };
    } else {
      const user = await Employee.findOne({
        isDelete: false,
        phoneNumber: username,
        password: hashPassword(password)
      }).lean();
      if (!user) {
        return res.status(404).json({ error: "Thông tin đăng nhập không chính xác" });
      }
      userToSign = user;

      tokenPayload = {
        userId: user._id.toString(),
        level: user.level
      };
    }
    const tokens = generate.token(tokenPayload);
    const newRefreshToken = new RefreshToken({
      userId: tokenPayload.userId,
      token: tokens.refreshToken
    });

    await newRefreshToken.save();

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true, // true nếu là HTTPS
      sameSite: "none",
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000 // 30 ngày
    });
    res.status(200).json({
      data: {
        user: userToSign,
        accessToken: tokens.accessToken
      },
      message: "Đăng nhập thành công"
    });
  } catch (error) {
    logger("ERROR", error);
    res.status(500).send(String(error).split("\n").at(0));
    return res.end();
  }
};

export const refreshTokenSlug: string = "/refresh_token";
export const refreshToken: any = async (req: Request, res: Response) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;

    if (!tokenFromCookie) {
      return res.status(401).json({ error: "Không tìm thấy refresh token" });
    }
    let minimalPayload: { userId: string; iat: number; exp: number };
    try {
      minimalPayload = await webToken.verify(tokenFromCookie, ENV.REFRESH_TOKEN_SECRET);
    } catch (err) {
      logger("WARNING", "Refresh token không hợp lệ hoặc đã hết hạn", err);
      return res
        .status(403)
        .json({ message: "Refresh token không hợp lệ, vui lòng đăng nhập lại" });
    }
    let newAccessTokenPayload: IToken;
    let userToReturn: any;
    if (minimalPayload?.userId === ENV.ADMIN_ID) {
      newAccessTokenPayload = {
        userId: ENV.ADMIN_ID,
        level: ENV.ADMIN_PERMISSION
      };
      userToReturn = {
        userId: ENV.ADMIN_ID,
        name: ENV.ADMIN_NAME,
        username: ENV.ADMIN_USER_NAME,
        phoneNumber: ENV.ADMIN_PHONE_NUMBER,
        fullName: ENV.ADMIN_FULL_NAME,
        level: ENV.ADMIN_PERMISSION
      };
    } else {
      const user = await Employee.findById(minimalPayload.userId).lean();
      if (!user) {
        logger("WARNING", `Refresh token: User not found for ID: ${minimalPayload.userId}`);
        return res.status(403).json({ message: "Không tìm thấy người dùng" });
      }
      newAccessTokenPayload = {
        userId: user._id.toString(),
        level: user.level
      };
      userToReturn = user;
    }

    const newAccessToken = generate.token(newAccessTokenPayload).accessToken;
    res.status(200).json({
      accessToken: newAccessToken,
      user: userToReturn
    });
  } catch (error) {
    logger("ERROR", error);
    res.status(500).send(String(error).split("\n").at(0));
    return res.end();
  }
};

export const signOutSlug: string = "/sign-out";
export const signOut: any = async (req: Request, res: Response) => {
  try {
    const tokenFromCookie = req.cookies?.refreshToken;

    if (tokenFromCookie) {
      await RefreshToken.deleteOne({ userId: req.token.userId, token: refreshToken });
    }
    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: new Date(0)
    });

    res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    logger("ERROR", error);
    res.status(500).send(String(error).split("\n").at(0));
    return res.end();
  }
};
