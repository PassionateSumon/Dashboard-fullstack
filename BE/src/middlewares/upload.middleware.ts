import { Request, Response, NextFunction } from "express";
import ApiErrorHandler from "../utils/ApiErrorHandler.utils";
import cloudinary from "../config/cloudinary";

export const uploadCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const file = req.file;
    if (!file) {
      return next();
    }
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "certificates",
      resource_type: "auto",
    });

    req.body.certificate = result.secure_url;
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(500, "Internal server error at upload middleware!")
      );
  }
};
