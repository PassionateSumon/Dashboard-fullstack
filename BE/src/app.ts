import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route";
import dotenv from "dotenv";
import morgan from "morgan";
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
app.use(morgan("dev"));
// generateAccessToken();

app.use("/api/v1/users", userRouter);


export default app;
