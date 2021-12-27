import { verifyNormalJWT } from "./tools.js";
import userSchema from "../../db/modals/user/user.js";
import createError from "http-errors";

export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.cookies.accessToken) {
    next(createError(401, "No access token"));
  } else {
    try {
      const token = req.cookies.accessToken;

      const decodedToken = await verifyNormalJWT(token);

      const user = await userSchema.findById(decodedToken._id);

      if (user) {
        req.user = user;

        next();
      } else {
        next(createError(404, "User not found"));
      }
    } catch (error) {
      next(error);
    }
  }
};