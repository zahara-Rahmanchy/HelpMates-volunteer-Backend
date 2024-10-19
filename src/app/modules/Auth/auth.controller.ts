import {Request, Response} from "express";
import catchAsync from "../../../shared/catchAsync";
import {AuthServices} from "./auth.service";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import {request} from "../../../middlewares/auth";
// logging user based on the user credentials
const loginUser = catchAsync(async (req: Request, res: Response) => {
  console.log("req: ", req);
  const result = await AuthServices.loginUser(req.body);
  console.log({result});
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: result,
  });
});

// change password
const changePasswordOfUser = catchAsync(async (req: Request, res: Response) => {
  console.log("hellloooooooooooooooooooooooooooooooooooooooooooo");
  console.log("req: ", req.body, "user: ", req.user);
  const data = {
    email: req?.user?.email,
    ...req.body,
  };
  const result = await AuthServices.changePassword(data);
  console.log({result});
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

export const AuthController = {
  loginUser,
  changePasswordOfUser,
};
