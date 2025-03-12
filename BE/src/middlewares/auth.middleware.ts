import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiErrorHandler from "../utils/ApiErrorHandler.utils";
import dotenv from "dotenv";
dotenv.config();

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): any => {
  try {
    const token = req?.cookies.accessToken || req?.headers.authorization;
    // console.log(token)
    if (!token) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Unauthorized in middleware!"));
    }

    const secret = process.env.JWT_ACCESS_SECRET as string;
    if (!secret) {
      return res
        .status(401)
        .json(new ApiErrorHandler(401, "Server secret key problem!!"));
    }

    jwt.verify(token, secret, (err: any, decoded: any) => {
      if (err) {
        // console.log("here")
        return res.status(401).json(new ApiErrorHandler(401, "Unauthorized!"));
      }

      req.user = decoded as { userId: string };
      next();
    });
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiErrorHandler(
          500,
          "Internal server error at catch in auth middleware!"
        )
      );
  }
};

//************ */

// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";
// import ApiErrorHandler from "../utils/ApiErrorHandler.utils";
// import dotenv from "dotenv";
// import { generateAccessToken } from "../utils/jwt";
// dotenv.config();

// export interface AuthRequest extends Request {
//   user?: { userId: string };
// }

// export const authMiddleware = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     let token = req?.cookies.accessToken || req?.headers.authorization;
//     const refreshToken = req?.cookies.refreshToken;

//     const accessSecret = process.env.JWT_ACCESS_SECRET as string;
//     const refreshSecret = process.env.JWT_REFRESH_SECRET as string;

//     if (!accessSecret || !refreshSecret) {
//       return res
//         .status(500)
//         .json(new ApiErrorHandler(500, "Server secret key problem!!"));
//     }

//     if (!token) {
//       return res
//         .status(401)
//         .json(new ApiErrorHandler(401, "Unauthorized: No access token!"));
//     }

//     jwt.verify(token, accessSecret, (err: any, decoded: any) => {
//       if (err) {
//         console.log(
//           "Access token expired or invalid, checking refresh token..."
//         );

//         if (!refreshToken) {
//           return res
//             .status(401)
//             .json(new ApiErrorHandler(401, "Unauthorized: No refresh token!"));
//         }

//         jwt.verify(
//           refreshToken,
//           refreshSecret,
//           (refreshErr: any, refreshDecoded: any) => {
//             if (refreshErr) {
//               return res
//                 .status(401)
//                 .json(
//                   new ApiErrorHandler(
//                     401,
//                     "Unauthorized: Invalid refresh token!"
//                   )
//                 );
//             }

//             // Generate a new access token
//             const newAccessToken = generateAccessToken(refreshDecoded.userId);

//             // Set the new access token in cookies
//             res.cookie("accessToken", newAccessToken, {
//               httpOnly: true,
//               secure: process.env.NODE_ENV === "production",
//               sameSite: "strict",
//             });

//             req.user = { userId: refreshDecoded.userId };
//             next();
//           }
//         );
//       } else {
//         req.user = decoded as { userId: string };
//         next();
//       }
//     });
//   } catch (error) {
//     return res
//       .status(500)
//       .json(
//         new ApiErrorHandler(500, "Internal server error in auth middleware!")
//       );
//   }
// };
