import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiErrorHandler from "../utils/ApiErrorHandler.utils";
import ApiResponseHandler from "../utils/ApiResponseHandler.utils";
import prisma from "../db/db";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { AuthRequest } from "../middlewares/auth.middleware";

export const signup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req?.body;
    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Must give all credentials!"));
    }

    const existedUser = await prisma.user.findUnique({ where: { email } });
    if (existedUser) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "User already exists!"));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "User created successfully.", user));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiErrorHandler(500, "Internal server error at signup!"));
  }
};

export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req?.body;
    if (!email || !password) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Must give all credentials!"));
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(400).json(new ApiErrorHandler(400, "User not found!"));
    }

    const isValidPassword = bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json(new ApiErrorHandler(400, "Wrong password!"));
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.json({ accessToken });
  } catch (error) {
    return res
      .status(500)
      .json(new ApiErrorHandler(500, "Internal server error at login!"));
  }
};

export const refresh = async (req: Request, res: Response): Promise<any> => {
  const { refreshToken } = req.cookies;
  // console.log(refreshToken);
  if (!refreshToken) {
    return res.status(401).json(new ApiErrorHandler(401, "Unauthorized!"));
  }

  try {
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      userId: string;
    };

    const user = await prisma.user.findUnique({
      where: {
        id: decoded.userId,
      },
    });
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json(new ApiErrorHandler(403, "Invalid refresh token!"));
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true, // for now true but later it will be changed
      sameSite: "strict",
    });
    res.status(200).json(
      new ApiResponseHandler(200, "Token refreshed successfully.", {
        newAccessToken,
      })
    );
  } catch (error) {
    return res
      .status(500)
      .json(new ApiErrorHandler(500, "Internal server error at refresh!"));
  }
};

export const logout = async (req: Request, res: Response): Promise<any> => {
  try {
    const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json(new ApiErrorHandler(401, "Unauthorized!"));
    }
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
      userId: string;
    };

    await prisma.user.update({
      where: { id: decoded.userId },
      data: { refreshToken: null },
    });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Logged out successfully."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiErrorHandler(500, "Internal server error at logout!"));
  }
};

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const id = req?.user?.userId;
    const user = await prisma.user.findUnique({
      where: { id },
      omit: { password: true, refreshToken: true },
    });

    if (!user) {
      return res.status(404).json(new ApiErrorHandler(404, "User not found!"));
    }

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Profile fetched.", user));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch to get profile!"
        )
      );
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const input = req?.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    if (!input.password) {
      input.password = user?.password;
    }
    if (!input?.email) {
      input.email = user?.email;
    }

    if (!user) {
      return res.status(400).json(new ApiErrorHandler(400, "User not found!"));
    }

    const updatedUserProfile = await prisma.user.upsert({
      where: { id },
      update: input,
      create: input,
      omit: { password: true, refreshToken: true },
    });

    return res
      .status(200)
      .json(
        new ApiResponseHandler(
          200,
          "Profile updated successfully!",
          updatedUserProfile
        )
      );
  } catch (error) {
    console.error("Update Profile Error:", error);
    return res
      .status(500)
      .json(
        new ApiErrorHandler(500, "Internal server error at update profile!")
      );
  }
};

export const createSkill = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const id = req?.user?.userId;
    const inputSkill = req?.body;

    if (!inputSkill.name) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Skill name is required!"));
    }

    await prisma.skill.create({
      data: {
        userId: id,
        ...inputSkill,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id },
      include: { skills: true },
      omit: { password: true, refreshToken: true },
    });
    if (!user) {
      return res
        .status(400)
        .json(new ApiResponseHandler(400, "Can't find user!"));
    }

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Skill created.", user));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponseHandler(
          500,
          "Internal server error at catch in createSkill"
        )
      );
  }
};

export const updateSkill = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const userId = req?.user?.userId;
    const skillId = req?.params?.sId;
    const inputSkill = req?.body;

    if (!skillId) {
      return res
        .status(400)
        .json(new ApiResponseHandler(400, "Skill id must be needed!"));
    }

    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });
    if (!skill) {
      return res
        .status(400)
        .json(new ApiResponseHandler(400, "Can't find skill!"));
    }

    if (!inputSkill.name) {
      inputSkill.name = skill.name;
    }

    await prisma.skill.update({
      where: { id: skillId },
      data: { ...inputSkill },
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { skills: true },
      omit: { password: true, refreshToken: true },
    });
    if (!user) {
      return res
        .status(400)
        .json(new ApiResponseHandler(400, "Can't find user!"));
    }

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Skill updated.", user));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponseHandler(
          500,
          "Internal server error at catch in createSkill"
        )
      );
  }
};

export const createEducation = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const id = req?.user?.userId;
    const { institute, startDate } = req?.body;
    // console.log({ institute, startDate});

    if (!institute) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Institute name is required!"));
    }
    console.log(!startDate ? true : false);
    if (!startDate) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "startdate is required!"));
    }

    await prisma.education.create({
      data: {
        userId: id,
        startDate: new Date(startDate).toISOString(),
        institute,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id },
      include: { education: true },
      omit: { password: true, refreshToken: true },
    });
    if (!user) {
      return res
        .status(400)
        .json(new ApiResponseHandler(400, "Can't find user!"));
    }

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Skill created.", user));
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json(
        new ApiResponseHandler(
          500,
          "Internal server error at catch in createSkill"
        )
      );
  }
};

export const updateEducation = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  try {
    const id = req?.user?.userId;
    const eduId = req?.params?.eId;
    let { institute, degree, fieldOfStudy, startDate, endTime, certificate } =
      req?.body;
    if (!eduId) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Education id is required!"));
    }

    const education = await prisma.education.findUnique({
      where: { id: eduId },
    });

    if (!education) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find education!"));
    }

    if (!institute) {
      institute = education.institute;
    }

    if (!startDate) {
      startDate = education.startDate;
    }

    await prisma.education.update({
      where: { id: eduId },
      data: {
        institute,
        degree,
        fieldOfStudy,
        startDate: new Date(startDate).toISOString(),
        endTime: new Date(endTime).toISOString(),
        certificate,
      },
    });

    const user = await prisma.user.findUnique({
      where: { id },
      include: { education: true },
      omit: { password: true, refreshToken: true },
    });
    console.log("7");
    if (!user) {
      return res
        .status(400)
        .json(new ApiResponseHandler(400, "Can't find user!"));
    }
    console.log("8");

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Education updated.", user));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch in updateEducation!"
        )
      );
  }
};

export const createHobby = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {};

export const updateHobby = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {};

export const createExperience = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {};

export const updateExperience = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {};
