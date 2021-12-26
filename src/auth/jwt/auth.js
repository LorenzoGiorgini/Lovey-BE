import { verifyNormalJWT } from "./auth-tools.js";
import { userSchema } from "../../db/modals/user/user.js";
import createHttpError from "http-errors";
 
export const JWTAuthMiddleware = async (req, res, next) => {
  if (!req.headers.authorization) {
    next(createHttpError(401, "Not authorized"))
  } else {
    try {
      const token = req.headers.authorization.split(" ")[1];

      const decodedToken = await verifyNormalJWT(token);

      const user = await userSchema.findById(decodedToken._id);
      if (user) {
        req.user = user;
        next();
      } else {
        next(createHttpError(404, "User not found"))
      }
    } catch (error) {
        next(createHttpError(404, "Token not valid"))
    }
  }
};