import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ApiErrorHandler from "../utils/ApiErrorHandler.utils";
import ApiResponseHandler from "../utils/ApiResponseHandler.utils";
import prisma from "../db/db";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { AuthRequest } from "../middlewares/auth.middleware";
import cloudinary from "../config/cloudinary";

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

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json(new ApiErrorHandler(400, "Wrong password!"));
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .cookie("accessToken", accessToken);

    res.status(200).json(new ApiResponseHandler(200, "login successful."));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiErrorHandler(500, "Internal server error at login!"));
  }
};

export const refresh = async (req: Request, res: Response): Promise<any> => {
  const { refreshToken } = req?.cookies;
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
        .status(401)
        .json(new ApiErrorHandler(401, "Invalid refresh token!"));
    }

    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: newRefreshToken },
    });

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // for now true but later it will be changed
      sameSite: "strict",
    });
    res.cookie("accessToken", newAccessToken, {
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

export const validateToken = async (
  req: Request,
  res: Response
): Promise<any> => {
  try {
    const accessToken = req?.cookies?.accessToken;
    // console.log("verify token: ",accessToken)
    const isMatched = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_SECRET as string
    );
    // console.log(isMatched)
    if (!isMatched) {
      return res
        .status(403)
        .json(new ApiErrorHandler(403, "Access token not found!"));
    }
    return res
      .status(200)
      .json(new ApiResponseHandler(200, "token verified!", { status: 200 }));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiErrorHandler(500, "Internal server error at verifyToken!"));
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

    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      secure: true,
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
      include: {
        skills: true,
        experience: true,
        hobbies: true,
        education: true,
      },
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
      include: {
        skills: true,
        experience: true,
        education: true,
        hobbies: true,
      },
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

    const newSkill = await prisma.skill.create({
      data: {
        userId: id,
        ...inputSkill,
      },
    });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Skill created.", newSkill));
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

export const getAllSkills = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { skills: true },
    });
    if (!user) {
      return res.status(400).json(new ApiErrorHandler(400, "Can't find user!"));
    }
    if (!user.skills) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find any skill!"));
    }

    return res
      .status(200)
      .json(
        new ApiResponseHandler(200, "Successfully fetched skills.", user.skills)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(500, "Internal server error to get all skills!")
      );
  }
};

export const getSingleSkill = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const sId = req?.params?.sId;

  try {
    if (!sId) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Skill id is needed!"));
    }
    const skill = await prisma.skill.findUnique({ where: { id: sId } });
    if (!skill) {
      return res.status(400).json(new ApiErrorHandler(400, "Can't get skill!"));
    }
    if (skill.userId !== id) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized to get skill!"));
    }
    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Get successfully.", skill));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(500, "Internal server error to get single skill!")
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
    // console.log(inputSkill)

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

    if (skill.userId !== userId) {
      return res
        .status(401)
        .json(new ApiResponseHandler(401, "Unauthorized to update skill!"));
    }

    if (!inputSkill.name) {
      inputSkill.name = skill.name;
    }

    const updatedSkill = await prisma.skill.update({
      where: { id: skillId },
      data: { ...inputSkill },
    });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Skill updated.", updatedSkill));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponseHandler(
          500,
          "Internal server error at catch in updateSkill"
        )
      );
  }
};

export const deleteSingleSkill = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const sId = req?.params?.sId;

  try {
    if (!sId) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Skill id must be needed!"));
    }
    const skill = await prisma.skill.findUnique({ where: { id: sId } });
    if (!skill) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find skill!"));
    }
    if (skill.userId !== id) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized to delete skill!"));
    }

    if (skill.certificate) {
      const publicId = skill.certificate
        ?.split("/")
        .slice(-2)
        .join("/")
        .replace(".jpg", " ")
        .replace(".png", " ")
        .replace(".jpeg", " ")
        .replace(".pdf", " ");

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error(
          "Error while delete skill certificate in cloudinary!",
          error
        );
      }
    }

    const deletedSkill = await prisma.skill.delete({ where: { id: sId } });
    return res
      .status(200)
      .json(
        new ApiResponseHandler(200, "Skill successfully deleted!", deletedSkill)
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch to delete skill!"
        )
      );
  }
};

export const deleteAllSkills = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  try {
    const skills = await prisma.skill.findMany({
      where: { userId: id },
      select: { id: true, certificate: true },
    });

    if (skills.length === 0) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find skills!"));
    }

    const publicIds = skills
      .map((s) => s.certificate)
      .filter((cer) => cer)
      .map((url) => {
        const parts = url?.split("/");
        const fName = parts && parts[parts?.length - 1].split(".")[0];
        return `certificates/${fName}`;
      });

    if (publicIds.length > 0) await cloudinary.api.delete_resources(publicIds);

    await prisma.skill.deleteMany({ where: { userId: id } });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Successfully deleted all skills."));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch to delete all skills!"
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

    const newEducation = await prisma.education.create({
      data: {
        userId: id,
        startDate: new Date(startDate).toISOString(),
        institute,
      },
    });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Skill created.", newEducation));
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

export const getAllEducations = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { education: true },
    });
    if (!user) {
      return res.status(400).json(new ApiErrorHandler(400, "Can't find user!"));
    }
    if (!user.education) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find any skill!"));
    }

    return res
      .status(200)
      .json(
        new ApiResponseHandler(
          200,
          "Successfully fetched skills.",
          user.education
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(500, "Internal server error to get all education!")
      );
  }
};

export const getSingleEducation = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const eId = req?.params?.eId;

  try {
    if (!eId) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Education id is needed!"));
    }
    const education = await prisma.education.findUnique({ where: { id: eId } });
    if (!education) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't get education!"));
    }
    if (education.userId !== id) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized to get education!"));
    }
    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Get successfully.", education));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error to get single education!"
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

    if (education.userId !== id) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized to update education!"));
    }

    const updatedEducation = await prisma.education.update({
      where: { id: eduId },
      data: {
        institute: institute || education.institute,
        degree: degree ?? null,
        fieldOfStudy: fieldOfStudy ?? null,
        startDate: startDate
          ? new Date(startDate).toISOString()
          : education.startDate,
        endTime: endTime ? new Date(endTime).toISOString() : null,
        certificate: certificate ?? null,
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponseHandler(200, "Education updated.", updatedEducation)
      );
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

export const deleteSingleEducation = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const eId = req?.params?.eId;

  try {
    if (!eId) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Education id is required!"));
    }

    const edu = await prisma.education.findUnique({
      where: { id: eId },
      select: { id: true, certificate: true, userId: true },
    });
    if (!edu)
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find education!"));

    if (edu.userId !== id) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized to delete education!"));
    }

    const deletedItem = await prisma.education.delete({ where: { id: eId } });

    return res
      .status(200)
      .json(
        new ApiResponseHandler(
          200,
          "Education deleted successfully.",
          deletedItem
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch while deleting single education!"
        )
      );
  }
};

export const deleteAllEducations = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  try {
    await prisma.education.deleteMany({ where: { userId: id } });
    return res
      .status(200)
      .json(new ApiResponseHandler(200, "All educations deleted."));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch while deleting all the educations!"
        )
      );
  }
};

export const createHobby = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const { name } = req?.body;

  try {
    if (!name) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Name is required!"));
    }

    const newHobby = await prisma.hobby.create({
      data: {
        userId: id,
        name,
      },
    });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Hobby added.", newHobby));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiErrorHandler(500, "Internal server error to create hobby!"));
  }
};

export const getAllHobbies = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { hobbies: true },
    });
    if (!user) {
      return res.status(400).json(new ApiErrorHandler(400, "Can't find user!"));
    }
    if (!user.hobbies) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find any skill!"));
    }

    return res
      .status(200)
      .json(
        new ApiResponseHandler(
          200,
          "Successfully fetched skills.",
          user.hobbies
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(500, "Internal server error to get all hobbies!")
      );
  }
};

export const getSingleHobby = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const hId = req?.params?.hId;
  try {
    if (!hId) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Hobby id is required!"));
    }
    const hobby = await prisma.hobby.findUnique({ where: { id: hId } });
    if (!hobby) {
      return res.status(400).json(new ApiErrorHandler(400, "Can't get hobby!"));
    }
    if (hobby.userId !== id) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized to get hobby!"));
    }
    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Get successfully.", hobby));
  } catch (error) {
    res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch to get single hobby!"
        )
      );
  }
};

export const updateHobby = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const hId = req?.params?.hId;
  const { name } = req?.body;
  try {
    if (!hId)
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Hobby id is required!"));
    if (!name)
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Name is required!"));
    const hobby = await prisma.hobby.findUnique({ where: { id: hId } });
    if (hobby?.userId !== id) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized to update hobby!"));
    }
    const updatedHobby = await prisma.hobby.update({
      where: { id: hId },
      data: {
        name,
      },
    });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Hobby updated.", updateHobby));
  } catch (error) {
    return res
      .status(500)
      .json(new ApiErrorHandler(500, "Internal server error to update hobby!"));
  }
};

export const deleteSingleHobby = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const hId = req?.params?.hId;

  try {
    if (!hId) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Hobby id is required!"));
    }

    const hobby = await prisma.hobby.findUnique({ where: { id: hId } });
    if (!hobby)
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find hobby!"));
    if (hobby.userId !== id)
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unathorized to delete hobby!"));

    const deletedHobby = await prisma.hobby.delete({ where: { id: hId } });

    return res
      .status(200)
      .json(
        new ApiResponseHandler(200, "Hobby deleted successfully.", deletedHobby)
      );
  } catch (error) {}
};

export const deleteAllHobbies = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  try {
    await prisma.hobby.deleteMany({ where: { userId: id } });
    return res
      .status(200)
      .json(new ApiResponseHandler(200, "All hobbies deleted."));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch while deleting all the hobbies!"
        )
      );
  }
};

export const createExperience = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const { company, role, startDate, endDate, description, certificate } =
    req?.body;

  try {
    if (!company || !role || !startDate) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Credentials are required!"));
    }

    const newExp = await prisma.experience.create({
      data: {
        userId: id,
        company,
        role,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate ? new Date(endDate).toISOString() : null,
        description: description ?? null,
        certificate: certificate ?? null,
      },
    });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Experience added.", newExp));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(500, "Internal server error to create experience!")
      );
  }
};

export const getAllExperiences = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { experience: true },
    });
    if (!user) {
      return res.status(400).json(new ApiErrorHandler(400, "Can't find user!"));
    }
    if (!user.experience) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find any skill!"));
    }

    return res
      .status(200)
      .json(
        new ApiResponseHandler(
          200,
          "Successfully fetched skills.",
          user.experience
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(500, "Internal server error to get all experience!")
      );
  }
};

export const getSingleExperience = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const eId = req?.params?.eId;

  try {
    if (!eId) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Experience id is needed!"));
    }
    const exp = await prisma.experience.findUnique({ where: { id: eId } });
    if (!exp) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't get experience!"));
    }
    if (exp.userId !== id) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized to get experience!"));
    }
    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Get successfully.", exp));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error to get single experience!"
        )
      );
  }
};

export const updateExperience = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const exId = req?.params?.exId;
  const { company, role, startDate, endDate, description, certificate } =
    req?.body;

  try {
    if (!exId) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Experience id is required!"));
    }
    const exp = await prisma.experience.findUnique({
      where: { id: exId },
    });
    if (!exp) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Experience can't find!"));
    }
    if (exp.userId !== id) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized to update experience!"));
    }

    const updatedExp = await prisma.experience.update({
      where: { id: exId },
      data: {
        company: company || exp.company,
        role: role || exp.role,
        startDate: startDate
          ? new Date(startDate).toISOString()
          : exp.startDate,
        endDate: endDate ? new Date(endDate).toISOString() : exp.endDate,
        description: description ?? exp.description,
        certificate: certificate ?? exp.certificate,
      },
    });

    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Experience updated.", updatedExp));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(500, "Internal server error to update experience!")
      );
  }
};

export const deleteSingleExperience = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  const exId = req?.params?.exId;

  try {
    if (!exId) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Experience id is required!"));
    }

    const exp = await prisma.experience.findUnique({ where: { id: exId } });
    if (!exp) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find experience!"));
    }

    if (exp.userId !== id) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized to delete experience!"));
    }

    if (exp.certificate) {
      const publicId = exp.certificate
        .split("/")
        .slice(-2)
        .join("/")
        .replace(".jpg", "")
        .replace(".jpeg", "")
        .replace(".png", "")
        .replace(".pdf", "");

      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (error) {
        console.error(
          "Error deleting the Experience file from cloudinary!",
          error
        );
      }
    }

    const deletedExp = await prisma.experience.delete({
      where: { id: exId },
    });

    return res
      .status(200)
      .json(
        new ApiResponseHandler(
          200,
          "Experience deleted successfully.",
          deletedExp
        )
      );
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at delete single experience!"
        )
      );
  }
};

export const deleteAllExperiences = async (
  req: AuthRequest,
  res: Response
): Promise<any> => {
  const id = req?.user?.userId;
  try {
    const experiences = await prisma.experience.findMany({
      where: { userId: id },
      select: { id: true, certificate: true },
    });

    if (experiences.length === 0) {
      return res
        .status(400)
        .json(new ApiErrorHandler(400, "Can't find any experiences!"));
    }

    const publicIds = experiences
      .map((exp) => exp.certificate)
      .filter((cerUrl) => cerUrl)
      .map((url) => {
        const parts = url?.split("/");
        const fName = parts && parts[parts?.length - 1].split(".")[0];
        return `certificates/${fName}`;
      });

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
    }

    await prisma.experience.deleteMany({ where: { userId: id } });
    return res
      .status(200)
      .json(new ApiResponseHandler(200, "Deleted all experiences."));
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch while deleting all the experiences!"
        )
      );
  }
};
