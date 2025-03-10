import express from "express";
import {
  createEducation,
  createExperience,
  createHobby,
  createSkill,
  deleteAllExperiences,
  deleteAllHobbies,
  deleteSingleExperience,
  deleteSingleHobby,
  getAllEducations,
  getAllExperiences,
  getAllHobbies,
  getAllSkills,
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
import upload from "../config/multer";
import { uploadCloudinary } from "../middlewares/upload.middleware";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.post("/logout", authMiddleware, logout);
userRouter.post("/refresh", authMiddleware, refresh);
//******************************************************************************** */
userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.put("/update-profile", authMiddleware, updateProfile);
userRouter.post(
  "/create-skill",
  upload.single("certificate"),
  uploadCloudinary,
  authMiddleware,
  createSkill
);
//******************************************************************************** */
userRouter.get("/get-all-skills", authMiddleware, getAllSkills);
userRouter.put(
  "/update-skill/:sId",
  authMiddleware,
  upload.single("certificate"),
  uploadCloudinary,
  updateSkill
);
//******************************************************************************** */
userRouter.post(
  "/create-education",
  upload.single("certificate"),
  uploadCloudinary,
  authMiddleware,
  createEducation
);
userRouter.get("/get-all-educations", authMiddleware, getAllEducations);
userRouter.put(
  "/update-education/:eId",
  authMiddleware,
  upload.single("certificate"),
  uploadCloudinary,
  updateEducation
);
//******************************************************************************** */
userRouter.post("/create-hobby", authMiddleware, createHobby);
userRouter.get("/get-all-hobbies", authMiddleware, getAllHobbies);
userRouter.put("/update-hobby/:hId", authMiddleware, updateHobby);
userRouter.delete(
  "/delete-single-hobby/:hId",
  authMiddleware,
  deleteSingleHobby
);
userRouter.delete("/delete-all-hobbies", authMiddleware, deleteAllHobbies);
//******************************************************************************** */
userRouter.post(
  "/create-experience",
  upload.single("certificate"),
  uploadCloudinary,
  authMiddleware,
  createExperience
);
userRouter.get("/get-all-experiences", authMiddleware, getAllExperiences);
userRouter.put(
  "/update-experience/:exId",
  authMiddleware,
  upload.single("certificate"),
  uploadCloudinary,
  updateExperience
);
userRouter.delete(
  "/delete-single-experience/:exId",
  authMiddleware,
  deleteSingleExperience
);
userRouter.delete(
  "/delete-all-experiences",
  authMiddleware,
  deleteAllExperiences
);

export default userRouter;
