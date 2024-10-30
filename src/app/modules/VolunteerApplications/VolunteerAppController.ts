import httpStatus from "http-status";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";
import {Request, Response} from "express";
import {request} from "../../../middlewares/auth";
import {volunteerAppServices} from "./volunteerAppServices";

// insert VolunteerApplication to database along with the current userId received from req.userId
const insertVolunteerApplication = catchAsync(
  async (req: Request, res: Response) => {
    console.log("adopt controller:", req.body, req.user);

    const result = await volunteerAppServices.insertVolunteerApplicationToDB(
      req.body,
      String(req.user?.id)
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Volunteering application request submitted successfully",
      data: result,
    });
  }
);

// get VolunteerApplications database
const getVolunteerApplications = catchAsync(
  async (req: Request, res: Response) => {
    const result = await volunteerAppServices.getVolunteerApplicationFromDB();

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Volunteer Applications retrieved successfully",
      data: result,
    });
  }
);

// get applications by opportunity id

/*
  get VolunteerApplication made by specific user
*/
const getVolunteerApplicationsById = catchAsync(
  async (req: Request, res: Response) => {
    console.log("req.user: ", req.user);
    const result = await volunteerAppServices.getVolunteerApplicationByIdFromDB(
      String(req.user?.id)
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Volunteer Applications retrieved successfully",
      data: result,
    });
  }
);

// updating adoption data in the db based on the requestId
const updateVolunteerApplication = catchAsync(
  async (req: request, res: Response) => {
    console.log("user controller:", req.body, "id", req.params);

    const result = await volunteerAppServices.updateVolunteerApplicationInDB(
      req.params.applicationId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Volunteer application updated successfully",
      data: result,
    });
  }
);

// get Volunteering opportunities participated from database
const getVolunteeringParticipated = catchAsync(
  async (req: Request, res: Response) => {
    const result = await volunteerAppServices.getParticipatedOppFromDB(
      String(req?.user?.id)
    );
    if (result.length === 0) {
      return sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Not partcipated in any volunteering events yet!",
        data: result,
      });
    }
    return sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Volunteering opportunities participated retrieved successfully",
      data: result,
    });
  }
);
export const volunteerAppController = {
  insertVolunteerApplication,
  getVolunteerApplications,
  getVolunteerApplicationsById,
  getVolunteeringParticipated,
  updateVolunteerApplication,
};
