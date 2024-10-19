import {Request, Response} from "express";
import {userServices} from "./user.service";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {request} from "../../../middlewares/auth";

// creates user in the database
const createUser = catchAsync(async (req: request, res: Response) => {
  console.log("user controller:", req);

  const result = await userServices.createUserService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User registered successfully",
    data: result,
  });
});
// gets all the user information
const getUserProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await userServices.getUserProfileFromDB(String(req?.user?.id));

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User profile retrieved successfully",
    data: result,
  });
});

const getUsers = catchAsync(async (req: request, res: Response) => {
  const result = await userServices.getUsersFromDB();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: "User profile retrieved successfully",
    data: result,
  });
});

// updating user data such as name and email in the db
const updateUserData = catchAsync(async (req: Request, res: Response) => {
  console.log("user controller:", req.body, "id", req);
  const {id, ...rest} = req.body;
  const result = await userServices.updateUserDataInDB(String(id), rest);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User profile updated successfully",
    data: result,
  });
});
export const userControllers = {
  createUser,
  getUsers,
  getUserProfile,
  updateUserData,
};
