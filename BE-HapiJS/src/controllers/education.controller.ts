import type { Request, ResponseToolkit } from "@hapi/hapi";
import { error, success } from "../utils/returnFunction.util";
import { prisma } from "../db/db";
import { getCloudinaryPublicId, uploadToClodinary } from "../config/clodinary";
import { v2 as clodinary } from "cloudinary";

export const getAllEducationController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const allEducations = await prisma.education.findMany({
      where: { userId: id },
    });

    return success(
      allEducations,
      "All educations fetched successfully.",
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

export const createEducationController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const payload: any = req.payload;
    // console.log(payload.institute)

    if (!payload.institute) {
      return error(null, `Institute name is required!`, 400)(h);
    }
    if (!payload.startDate) {
      return error(null, `Start date is required!`, 400)(h);
    }

    const education = await prisma.education.create({
      data: {
        userId: id,
        institute: payload.institute,
        startDate: new Date(payload.startDate).toISOString(),
      },
    });

    return success(education, "Education created successfully.", 201)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const updateEducationController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const eId = req.params.id as string;

    const payload: any = req.payload;

    const currEducation = await prisma.education.findUnique({
      where: { id: eId },
    });
    if (!currEducation) {
      return error(null, "Education not found!", 400)(h);
    }
    if (currEducation.userId !== id) {
      return error(null, "Unathorized user for updating education!", 401)(h);
    }

    if (!payload.institute) {
      payload.name = currEducation.institute;
    }
    if (!payload.startDate) {
      payload.startDate = currEducation.startDate;
    } else {
      payload.startDate = new Date(payload.startDate).toISOString();
    }
    if (payload.endTime) {
      payload.endTime = new Date(payload.endTime).toISOString();
    } else {
      payload.endTime = currEducation.endTime;
    }

    let certificateUrl: string | null;
    if (payload.certificate) {
      certificateUrl = await uploadToClodinary(payload.certificate);
    } else {
      certificateUrl = currEducation.certificate;
    }

    const input = { ...payload };
    delete input.certificate;

    const updatedEducation = await prisma.education.update({
      where: { id: eId },
      data: {
        ...input,
        certificate: certificateUrl,
      },
    });

    return success(updatedEducation, "Education updated successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const deleteEducationController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const eId = req.params.id as string;

    const education = await prisma.education.findUnique({
      where: { id: eId },
    });
    if (!education) {
      return error(null, "Education not found!", 400)(h);
    }
    if (education.userId !== id) {
      return error(null, "Unauthorize to delete education!", 401)(h);
    }

    if (education.certificate) {
      const publicId = getCloudinaryPublicId(education.certificate);
      if (publicId) {
        await clodinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      }
    }

    const deletedEducation = await prisma.education.delete({
      where: { id: eId },
    });

    return success(deletedEducation, "Education deleted successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};
