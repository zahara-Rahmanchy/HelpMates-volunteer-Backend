import httpStatus from "http-status";
import {Request, Response} from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {MetaService} from "./MetaDataService";
import prisma from "../../../shared/prisma";

const fetchDashboardMetaData = catchAsync(
  async (req: Request, res: Response) => {
    const user = req.user;
    console.log("user details controller: ", req);
    const result = await MetaService.fetchDashboardMetaData(user as any);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Meta data retrived successfully!",
      data: result,
    });
  }
);
const getSignUpsFromDB = catchAsync(async (req: Request, res: Response) => {
  const {year, month} = req.query;
  console.log("reqeuwe: ", req.query);

  const result = await MetaService.getSignUps(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Meta data retrived successfully!",
    data: result,
  });
});

export const MetaController = {
  fetchDashboardMetaData,
  getSignUpsFromDB,
};
