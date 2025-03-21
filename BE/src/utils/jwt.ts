import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "1d";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "30d";

export const generateAccessToken = (userId: string) => {
  if (!ACCESS_SECRET) throw new Error("Access secret key not found!");
  try {
    const token = jwt.sign({ userId }, ACCESS_SECRET, {
      expiresIn: ACCESS_EXPIRES,
    });
    return token;
  } catch (error) {
    console.error("Error in jwt.sign:", error);
    throw error;
  }
};

export const generateRefreshToken = (userId: string) => {
  if (!REFRESH_SECRET) throw new Error("Access secret key not found!");
  try {
    return jwt.sign({ userId }, REFRESH_SECRET, {
      expiresIn: REFRESH_EXPIRES,
    });
  } catch (error) {
    console.error("Error in jwt.sign:", error);
    throw error;
  }
};
