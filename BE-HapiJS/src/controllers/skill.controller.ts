import { Request, ResponseToolkit } from "@hapi/hapi";
import { error, success } from "../utils/returnFunction.util";
import { prisma } from "../db/db";
import { getCloudinaryPublicId, uploadToClodinary } from "../config/clodinary";
import { v2 as clodinary } from "cloudinary";

export const getAllSkillsController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const allSkills = await prisma.skill.findMany({
      where: { userId: id },
    });

    return success(allSkills, "All skills fetched successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const createSkillController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const payload: any = req.payload;

    if (!payload.name) {
      return error(null, `Skill name is required!`, 400)(h);
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

    return success(skill, "Skill created successfully.", 201)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const updateSkillController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const sId = req.params.id as string;

    const payload: any = req.payload;

    const currSkill = await prisma.skill.findUnique({
      where: { id: sId },
    });
    if (!currSkill) {
      return error(null, "Skill not found!", 400)(h);
    }
    if (currSkill.userId !== id) {
      return error(null, "Unathorized user for updating skill!", 401)(h);
    }

    if (!payload.name) {
      payload.name = currSkill.name;
    }

    let certificateUrl: string | null;
    if (payload.certificate) {
      certificateUrl = await uploadToClodinary(payload.certificate);
    } else {
      certificateUrl = currSkill.certificate;
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

export const deleteSkillController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const sId = req.params.id as string;

    const skill = await prisma.skill.findUnique({
      where: { id: sId },
    });
    if (!skill) {
      return error(null, "Skill not found!", 400)(h);
    }
    if (skill.userId !== id) {
      return error(null, "Unauthorize to delete skill!", 401)(h);
    }

    if (skill.certificate) {
      const publicId = getCloudinaryPublicId(skill.certificate);
      if (publicId) {
        await clodinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      }
    }

    const deletedSkill = await prisma.skill.delete({
      where: { id: sId },
    });

    return success(deletedSkill, "Skill deleted successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};
