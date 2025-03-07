import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const ACCESS_EXPIRES = process.env.JWT_ACCESS_EXPIRES || "15m";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES || "1209600";

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
      expiresIn: parseInt(REFRESH_EXPIRES),
    });
  } catch (error) {
    console.error("Error in jwt.sign:", error);
    throw error;
  }
};
