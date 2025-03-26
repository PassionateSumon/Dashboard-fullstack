import { Request, ResponseToolkit } from "@hapi/hapi";
import { error, success } from "../utils/returnFunction.util";
import { prisma } from "../db/db";
import { getCloudinaryPublicId, uploadToClodinary } from "../config/clodinary";
import { v2 as clodinary } from "cloudinary";

export const getAllExperiencesController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const allExperiences = await prisma.experience.findMany({
      where: { userId: id },
    });

    return success(
      allExperiences,
      "All experiences fetched successfully.",
      200
    )(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const createExperienceController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const payload: any = req.payload;
    // console.log("Skill -- ", payload)

    if (!payload.company) {
      return error(null, `Company name is required!`, 400)(h);
    }
    if (!payload.role) {
      return error(null, `Role name is required!`, 400)(h);
    }
    if (!payload.startDate) {
      return error(null, `Start date name is required!`, 400)(h);
    }

    let certificateUrl: string | undefined;
    if (payload.certificate) {
      certificateUrl = await uploadToClodinary(payload.certificate);
    }

    const input = { ...payload };
    delete input.certificate;

    const skill = await prisma.skill.create({
      data: {
        ...input,
        userId: id,
        certificate: certificateUrl,
      },
    });

    return success(skill, "Experience created successfully.", 201)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const updateExperienceController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const sId = req.params.id as string;

    const payload: any = req.payload;

    const currExp = await prisma.experience.findUnique({
      where: { id: sId },
    });
    if (!currExp) {
      return error(null, "Experience not found!", 400)(h);
    }
    if (currExp.userId !== id) {
      return error(null, "Unathorized user for updating experience!", 401)(h);
    }

    if (!payload.company) {
      payload.company = currExp.company;
    }
    if (!payload.role) {
      payload.role = currExp.role;
    }
    if (!payload.startDate) {
      payload.startDate = currExp.startDate;
    } else {
      payload.startDate = new Date(payload.startDate).toISOString();
    }
    if (payload.endDate) {
      payload.startDate = new Date(payload.endDate).toISOString();
    }

    let certificateUrl: string | null;
    if (payload.certificate) {
      certificateUrl = await uploadToClodinary(payload.certificate);
    } else {
      certificateUrl = currExp.certificate;
    }

    const input = { ...payload };
    delete input.certificate;

    const updatedSkill = await prisma.skill.update({
      where: { id: sId },
      data: {
        ...input,
        certificate: certificateUrl,
      },
    });

    return success(updatedSkill, "Skill updated successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const deleteExperienceController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const exId = req.params.id as string;

    const experience = await prisma.experience.findUnique({
      where: { id: exId },
    });
    if (!experience) {
      return error(null, "Experience not found!", 400)(h);
    }
    if (experience.userId !== id) {
      return error(null, "Unauthorize to delete experience!", 401)(h);
    }

    if (experience.certificate) {
      const publicId = getCloudinaryPublicId(experience.certificate);
      if (publicId) {
        await clodinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      }
    }

    const deletedExperience = await prisma.skill.delete({
      where: { id: exId },
    });

    return success(
      deletedExperience,
      "Experience deleted successfully.",
      200
    )(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};
