import express from "express";
import {
  createEducation,
  createExperience,
  createHobby,
  createSkill,
  getProfile,
  login,
  logout,
  refresh,
  signup,
  updateEducation,
  updateExperience,
  updateHobby,
  updateProfile,
  updateSkill,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", authMiddleware, logout);
userRouter.post("/refresh", authMiddleware, refresh);
userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.put("/update-profile", authMiddleware, updateProfile);
userRouter.post("/create-skill", authMiddleware, createSkill);
userRouter.put("/update-skill/:sId", authMiddleware, updateSkill);
userRouter.post("/create-education", authMiddleware, createEducation);
userRouter.put("/update-education/:eId", authMiddleware, updateEducation);
userRouter.post("/create-hobby", authMiddleware, createHobby);
userRouter.put("/update-hobby/:hId", authMiddleware, updateHobby);
userRouter.post("/create-experience", authMiddleware, createExperience);
userRouter.put("/update-experience/:exId", authMiddleware, updateExperience);

export default userRouter;
