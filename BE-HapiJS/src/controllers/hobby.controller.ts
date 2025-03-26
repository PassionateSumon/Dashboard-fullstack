import { Request, ResponseToolkit } from "@hapi/hapi";
import { error, success } from "../utils/returnFunction.util";
import { prisma } from "../db/db";

export const getAllHobbiesController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const allHobbies = await prisma.hobby.findMany({
      where: { userId: id },
    });

    return success(allHobbies, "All hobbies fetched successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const createHobbyController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const payload: any = req.payload;
    // console.log("Skill -- ", payload)

    if (!payload.name) {
      return error(null, `Hobby name is required!`, 400)(h);
    }

    const hobby = await prisma.hobby.create({
      data: {
        ...payload,
        userId: id,
      },
    });

    return success(hobby, "Hobby created successfully.", 201)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const updateHobbyController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const sId = req.params.id as string;

    const payload: any = req.payload;

    const currHobby = await prisma.hobby.findUnique({
      where: { id: sId },
    });
    if (!currHobby) {
      return error(null, "Hobby not found!", 400)(h);
    }
    if (currHobby.userId !== id) {
      return error(null, "Unathorized user for updating hobby!", 401)(h);
    }

    if (!payload.name) {
      payload.name = currHobby.name;
    }

    const updatedHobby = await prisma.hobby.update({
      where: { id: sId },
      data: {
        ...payload,
      },
    });

    return success(updatedHobby, "Hobby updated successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const deleteHobbyController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const hId = req.params.id as string;

    const hobby = await prisma.hobby.findUnique({
      where: { id: hId },
    });
    if (!hobby) {
      return error(null, "Hobby not found!", 400)(h);
    }
    if (hobby.userId !== id) {
      return error(null, "Unauthorize to delete hobby!", 401)(h);
    }

    const deletedHobby = await prisma.hobby.delete({
      where: { id: hId },
    });

    return success(deletedHobby, "Hobby deleted successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};
