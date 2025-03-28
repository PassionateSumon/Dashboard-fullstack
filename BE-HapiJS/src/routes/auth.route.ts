import type { ServerRoute } from "@hapi/hapi";
import {
  loginController,
  logoutController,
  refreshController,
  signupController,
  validateTokenController,
} from "../controllers/auth.controller";
import Joi from "joi";

const authRoutes: ServerRoute[] = [
  {
    method: "POST",
    path: "/signup",
    handler: signupController,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().messages({
            "any.required": "email is required!",
          }),
          password: Joi.string().required().messages({
            "any.required": "password is required!",
          }),
        }),
        failAction: (request, h, err: any) => {
          // console.log(err);
          const errorMessage =
            err?.details?.[0]?.message || "Invalid request payload.";
          return h
            .response({ status: "Failed", error: errorMessage })
            .code(400)
            .takeover();
        },
      },
      tags: ["api", "auth"],
      description: "Signup a new user.",
      auth: false,
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
  {
    method: "POST",
    path: "/login",
    handler: loginController,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required().messages({
            "any.required": "email is required!",
          }),
          password: Joi.string().required().messages({
            "any.required": "password is required!",
          }),
        }),
        failAction: (request, h, err: any) => {
          // console.log(err);
          const errorMessage =
            err?.details?.[0]?.message || "Invalid request payload.";
          return h
            .response({ status: "Failed", error: errorMessage })
            .code(400)
            .takeover();
        },
      },
      tags: ["api", "auth"],
      description: "Login a user.",
      auth: false,
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
  {
    method: "POST",
    path: "/logout",
    handler: logoutController,
    options: {
      tags: ["api", "auth"],
      description: "Logout a user.",
      auth: "jwt_access",
    },
  },
  {
    method: "GET",
    path: "/verify-token",
    handler: validateTokenController,
    options: {
      tags: ["api", "auth"],
      description: "Verify the current token access.",
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/refresh",
    handler: refreshController,
    options: {
      tags: ["api", "auth"],
      description: "Refresh tokens and Token rotation.",
      auth: false,
    },
  },
];

export default authRoutes;
