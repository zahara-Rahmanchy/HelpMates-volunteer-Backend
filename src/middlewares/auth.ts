import {NextFunction, Request, Response} from "express";
import catchAsync from "../shared/catchAsync";
import httpStatus from "http-status";
import {Secret} from "jsonwebtoken";
import {jwtHelpers} from "../app/helpers/jwtHelpers";
import ApiError from "../app/erros/ApiError";

export interface request extends Request {
  userId?: String;
}
/**
 * verifies the user based on the token
 *
 */
const auth = (...requiredRoles: string[]) => {
  // eslint-disable-next-line no-unused-vars
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    console.log("headers", req.headers);
    const token = req.headers.authorization;

    // check if the token is not available

    if (!token) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized Access",
        "",
        "You do not have permission to access this information"
      );
    }
    const verifiedUser = jwtHelpers.verifyToken(
      token,
      process.env.JWT_SECRET as Secret
    );
    const {exp} = verifiedUser;
    if (Math.floor(Date.now() / 1000) >= Number(verifiedUser?.exp)) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        "Unauthorized Access",
        "",
        "You do not have permission to access"
      );
    }
    req.user = verifiedUser; // role  , userid

    // role diye guard korar jnno
    if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        "Forbidden",
        "",
        "This path is forbidden"
      );
    }
    next();
  });
};

export default auth;
