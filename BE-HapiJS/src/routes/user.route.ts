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
import {
  createEducationController,
  deleteEducationController,
  getAllEducationController,
  updateEducationController,
} from "../controllers/education.controller";
import {
  createExperienceController,
  deleteExperienceController,
  getAllExperiencesController,
  updateExperienceController,
} from "../controllers/experience.controller";
import {
  createHobbyController,
  deleteHobbyController,
  getAllHobbiesController,
  updateHobbyController,
} from "../controllers/hobby.controller";

const userRoutes: ServerRoute[] = [
  {
    method: "GET",
    path: "/get-profile",
    handler: getProfileController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user"],
      description: "Get user profile."
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
  {
    method: "GET",
    path: "/get-all-educations",
    handler: getAllEducationController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "education"],
      description: "Get all educations.",
    },
  },
  {
    method: "POST",
    path: "/create-education",
    handler: createEducationController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "education"],
      description: "Create a education.",
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
  {
    method: "PUT",
    path: "/update-education/{id}",
    handler: updateEducationController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "education"],
      description: "Update a education.",
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
    path: "/delete-single-education/{id}",
    handler: deleteEducationController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "education"],
      description: "Delete a education.",
    },
  },
  {
    method: "GET",
    path: "/get-all-experiences",
    handler: getAllExperiencesController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "experience"],
      description: "Get all experiences.",
    },
  },
  {
    method: "POST",
    path: "/create-experience",
    handler: createExperienceController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "experience"],
      description: "Create a experience.",
      payload: {
        parse: true,
        output: "stream",
        multipart: true,
        allow: "multipart/form-data",
      },
    },
  },
  {
    method: "PUT",
    path: "/update-experience/{id}",
    handler: updateExperienceController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "experience"],
      description: "Update a experience.",
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
    path: "/delete-single-experience/{id}",
    handler: deleteExperienceController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "experience"],
      description: "Delete a experience.",
    },
  },
  {
    method: "GET",
    path: "/get-all-hobbies",
    handler: getAllHobbiesController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "hobby"],
      description: "Get all hobbies.",
    },
  },
  {
    method: "POST",
    path: "/create-hobby",
    handler: createHobbyController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "hobby"],
      description: "Create a hobby.",
      payload: {
        parse: true,
        output: "data",
      },
    },
  },
  {
    method: "PUT",
    path: "/update-hobby/{id}",
    handler: updateHobbyController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "hobby"],
      description: "Update a hobby.",
      payload: {
        output: "data",
        parse: true,
      },
    },
  },
  {
    method: "DELETE",
    path: "/delete-single-hobby/{id}",
    handler: deleteHobbyController,
    options: {
      auth: "jwt_access",
      tags: ["api", "user", "hobby"],
      description: "Delete a hobby.",
    },
  },
];

export default userRoutes;
