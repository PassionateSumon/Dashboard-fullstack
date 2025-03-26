import { ServerRoute } from "@hapi/hapi";
import {
  getProfileController,
  updateProfileController,
} from "../controllers/user.controller";
import {
  createSkillController,
  deleteSkillController,
  getAllSkillsController,
  updateSkillController,
} from "../controllers/skill.controller";

const userRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/get-profile",
    handler: getProfileController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user"],
      description: "Get user profile.",
    },
  },
  {
    method: "PUT",
    path: "/update-profile",
    handler: updateProfileController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user"],
      description: "Update user profile.",
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    method: "GET",
    path: "/get-all-skills",
    handler: getAllSkillsController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user"],
      description: "Get all skills.",
    },
  },
  {
    method: "POST",
    path: "/create-skill",
    handler: createSkillController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "skill"],
      description: "Create a skill.",
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    method: "PUT",
    path: "/update-skill/{id}",
    handler: updateSkillController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "skill"],
      description: "Update a skill.",
      payload: {
        output: "stream",
        parse: true,
        allow: "multipart/form-data",
        multipart: true,
      },
    },
  },
  {
    method: "DELETE",
    path: "/delete-single-skill/{id}",
    handler: deleteSkillController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "skill"],
      description: "Delete a skill.",
    },
  },
];

export default userRoutes;
