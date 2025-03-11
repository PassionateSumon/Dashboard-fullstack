import express from "express";
import {
  createEducation,
  createExperience,
  createHobby,
  createSkill,
  deleteAllEducations,
  deleteAllExperiences,
  deleteAllHobbies,
  deleteAllSkills,
  deleteSingleEducation,
  deleteSingleExperience,
  deleteSingleHobby,
  deleteSingleSkill,
  getAllEducations,
  getAllExperiences,
  getAllHobbies,
  getAllSkills,
  getProfile,
  getSingleEducation,
  getSingleExperience,
  getSingleHobby,
  getSingleSkill,
  login,
  logout,
  refresh,
  signup,
  updateEducation,
  updateExperience,
  updateHobby,
  updateProfile,
  updateSkill,
  validateToken,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import upload from "../config/multer";
import { uploadCloudinary } from "../middlewares/upload.middleware";

const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/verify-token", validateToken);
userRouter.post("/logout", authMiddleware, logout);
userRouter.post("/refresh", authMiddleware, refresh);
//******************************************************************************** */
userRouter.get("/get-profile", authMiddleware, getProfile);
userRouter.put("/update-profile", authMiddleware, updateProfile);
//******************************************************************************** */
userRouter.post(
  "/create-skill",
  upload.single("certificate"),
  uploadCloudinary,
  authMiddleware,
  createSkill
);
userRouter.get("/get-all-skills", authMiddleware, getAllSkills);
userRouter.get("/get-single-skill/:sId", authMiddleware, getSingleSkill);
userRouter.put(
  "/update-skill/:sId",
  authMiddleware,
  upload.single("certificate"),
  uploadCloudinary,
  updateSkill
);
userRouter.delete(
  "/delete-single-skill/:sId",
  authMiddleware,
  deleteSingleSkill
);
userRouter.delete("/delete-all-skills", authMiddleware, deleteAllSkills);
//******************************************************************************** */
userRouter.post(
  "/create-education",
  upload.single("certificate"),
  uploadCloudinary,
  authMiddleware,
  createEducation
);
userRouter.get("/get-all-educations", authMiddleware, getAllEducations);
userRouter.get(
  "/get-single-education/:eId",
  authMiddleware,
  getSingleEducation
);
userRouter.put(
  "/update-education/:eId",
  authMiddleware,
  upload.single("certificate"),
  uploadCloudinary,
  updateEducation
);
userRouter.delete("/delete-single-education/:eId", authMiddleware, deleteSingleEducation);
userRouter.delete("/delete-all-educations", authMiddleware, deleteAllEducations);
//******************************************************************************** */
userRouter.post("/create-hobby", authMiddleware, createHobby);
userRouter.get("/get-all-hobbies", authMiddleware, getAllHobbies);
userRouter.get("/get-single-hobby/:hId", authMiddleware, getSingleHobby);
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
userRouter.get(
  "/get-single-experience/:eId",
  authMiddleware,
  getSingleExperience
);
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
