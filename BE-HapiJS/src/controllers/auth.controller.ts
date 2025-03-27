import { Request, ResponseToolkit } from "@hapi/hapi";
import { prisma } from "../db/db";
import { error, success } from "../utils/returnFunction.util";
import { CryptoUtil } from "../utils/Crypto.util";
import { JWTUtil } from "../utils/Jwt.util";
import jwt from "jsonwebtoken";

export const signupController = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload = req.payload as any;
    console.log("", payload);
    const existedUser = await prisma.user.findUnique({
      where: { email: payload.email },
    });

    if (existedUser) {
      return error(null, "User already exists!", 400)(h);
    }

    const salt = CryptoUtil.generateSalt();
    const hashedPassword = CryptoUtil.hashPassword(payload.password, salt);

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        password: `${hashedPassword}:${salt}`,
      },
    });

    return success(user, "User created successfully!", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const loginController = async (req: Request, h: ResponseToolkit) => {
  try {
    const payload: any = req.payload;

    const { email, password } = payload;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return error(null, "User not found!", 404)(h);
    }

    const [hash, salt] = user.password.split(":");
    const isMatchedPassword = CryptoUtil.verifyPassword(password, salt, hash);
    if (!isMatchedPassword) {
      return error(null, "Invalid password!", 400)(h);
    }

    const validUser = await prisma.user.findUnique({
      where: { email },
      omit: { password: true },
    });

    const accessToken = JWTUtil.generateAccessToken((validUser as any).id);
    const refreshToken = JWTUtil.generateRefreshToken((validUser as any).id);

    await prisma.user.update({
      where: { email },
      data: { refreshToken },
    });

    h.state("accessToken", accessToken, {
      ttl: 1 * 24 * 60 * 60 * 1000, // 1 day
      path: "/",
      // isSecure: process.env.NODE_ENV === "production",
      isHttpOnly: false,
    });

    h.state("refreshToken", refreshToken, {
      ttl: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
      // isSecure: process.env.NODE_ENV === "production",
      isHttpOnly: false,
    });

    return success(null, "Login successfull.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const logoutController = async (req: Request, h: ResponseToolkit) => {
  try {
    const { userId } = req.auth.credentials as any;
    // console.log(userId)
    await prisma.user.update({
      where: { id: userId },
      data: {
        refreshToken: null,
      },
    });

    h.unstate("accessToken", { path: "/" });
    h.unstate("refreshToken", { path: "/" });

    return success(null, "Logged out successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const validateTokenController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const accessToken = req.state.accessToken;
    if (!accessToken) {
      return error(null, "No access token found!", 401)(h);
    }

    const secret = process.env.JWT_ACCESS_SECRET;
    if (!secret) {
      return error(null, "Access secret key not found!", 401)(h);
    }

    const verified = jwt.verify(accessToken, secret);
    // console.log(verified)
    if (!verified) {
      return error(null, "Unauthorized as access token is invalid!", 401)(h);
    }

    return success(null, "Token verified.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const refreshController = async (req: Request, h: ResponseToolkit) => {
  try {
    const refreshToken = req.state.refreshToken;
    if (!refreshToken) {
      return error(null, "No refresh token found!", 401)(h);
    }

    const secret = process.env.JWT_REFRESH_SECRET;
    if (!secret) {
      return error(null, "Refresh secret key not found!", 401)(h);
    }

    const verified = jwt.verify(refreshToken, secret);
    if (!verified) {
      return error(null, "Unauthorized as refresh token is invalid!", 401)(h);
    }

    const user = await prisma.user.findUnique({
      where: { id: (verified as any).userId },
    });
    if (!user || !user.refreshToken) {
      return error(null, "Invalid refresh token!", 400)(h);
    }

    const newAccessToken = JWTUtil.generateAccessToken(user.id);
    const newRefreshToken = JWTUtil.generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        refreshToken: newRefreshToken,
      },
    });

    h.state("accessToken", newAccessToken, {
      isHttpOnly: false,
      ttl: 1 * 24 * 60 * 60 * 1000,
    });
    h.state("refreshToken", newRefreshToken, {
      isHttpOnly: false,
      ttl: 7 * 24 * 60 * 60 * 1000,
    });

    return success(
      { newAccessToken, newRefreshToken },
      "Token refreshed successfully.",
      200
    )(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};
