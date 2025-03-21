import { Request, Response, NextFunction } from "express";
import ApiErrorHandler from "../utils/ApiErrorHandler.utils";
import cloudinary from "../config/cloudinary";
import fs from "fs";

export const uploadCloudinary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const file = req?.file;
    if (!file) {
      return next();
    }

    let folderName;
    if (req?.route?.path.includes("avatar")) folderName = "avatars";
    else if (req?.route?.path.includes("certificate"))
      folderName = "certificates";

    // console.log("22--",req?.route?.path)
    // console.log("23--",folderName)

    const result = await cloudinary.uploader.upload(file.path, {
      folder: folderName,
      resource_type: "auto",
    });

    fs.unlinkSync(file.path);
    if (folderName === "certificates") {
      req.body.certificate = result.secure_url;
    } else if (folderName === "avatars") {
      req.body.avatar = result.secure_url;
    }
    next();
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(500, "Internal server error at upload middleware!")
      );
  }
};
