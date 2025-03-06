import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import dotenv from "dotenv";
import { generateAccessToken } from "./utils/jwt";
dotenv.config();


const app = express();
app.use(
  cors({
    origin: process.env.DEV_ORIGIN,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("api/v1/users", userRouter);


export default app;
