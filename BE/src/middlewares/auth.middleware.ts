import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiErrorHandler from "../utils/ApiErrorHandler.utils";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): any => {
  try {
    const token = req?.cookies.accessToken || req?.headers.authorization;
    if (!token) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized in middleware!"));
    }

    const secret = process.env.JWT_ACCESS_SECRET as string;
    if (!secret) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Server secret key problem!!"));
    }

    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json(new ApiErrorHandler(401, "Unauthorized!"));
      }

      req.user = decoded as { userId: string };
      next();
    });
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch in auth middleware!"
        )
      );
  }
};
