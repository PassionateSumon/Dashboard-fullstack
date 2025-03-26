import { Request, ResponseToolkit } from "@hapi/hapi";
import { error, success } from "../utils/returnFunction.util";
import { prisma } from "../db/db";
import { uploadToClodinary } from "../config/clodinary";

export const getProfileController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    // console.log(req.auth)
    const id = (req.auth.credentials as any).userId;
    // console.log("User id -- 7 -- ", id);
    if (!id) {
      return error(null, `User id not found!`, 404)(h);
    }

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
      return error(null, `User not found!`, 404)(h);
    }

    return success(user, "User profile fetched successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

export const updateProfileController = async (
  req: Request,
  h: ResponseToolkit
) => {
  try {
    const id = req.auth.credentials.userId as string;
    const payload: any = req.payload;

    let avatarUrl: string | undefined;
    if (payload.avatar) {
      avatarUrl = await uploadToClodinary(payload.avatar);
    }

    const input = { ...payload };
    delete input.avatar;

    if (input.age) {
      input.age = Number(input.age);
    }
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return error(null, `User not found!`, 404)(h);
    }

    input.password = input.password || user.password;
    input.email = input.email || user.email;

    if (input.birthDate) {
      input.birthDate = input.birthDate.trim()
        ? new Date(input.birthDate).toISOString()
        : null;
    }

    const updatedDataInput = { ...input };
    if (avatarUrl) {
      updatedDataInput.avatar = avatarUrl;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updatedDataInput,
      include: {
        skills: true,
        education: true,
        experience: true,
        hobbies: true,
      },
      omit: {password: true, refreshToken: true}
    });

    return success(updatedUser, "User profile updated successfully.", 200)(h);
  } catch (err: any) {
    return error(
      null,
      `${err?.message}` || "Internal server error!",
      err?.code || 500
    )(h);
  }
};

