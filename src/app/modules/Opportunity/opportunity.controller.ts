import {Request, Response} from "express";

import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {opportunityServices} from "./opportunity.service";
import pick from "../../../shared/pick";
import {opportunityFilters} from "./opportunityConstants";
import {request} from "../../../middlewares/auth";

// insert Opportunity data to database
const insertOpportunityData = catchAsync(
  async (req: request, res: Response) => {
    console.log("user controller:", req.body);

    const result = await opportunityServices.insertOpportunityDataService(
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message: "Volunteering opportunity added successfully",
      data: result,
    });
  }
);

/* 
get Opportunity data from database, here searching is implemented on specfic fields
also filtering and meta options are also used to fetch data
*/

const getOpportunityData = catchAsync(async (req: request, res: Response) => {
  // console.log("user controller:", req.body);
  console.log("req.query: ", req.query);
  const filtersOptions = pick(req.query, opportunityFilters);
  const metaOptions = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);
  const data = await opportunityServices.getOpportunityDataFromDB(
    filtersOptions,
    metaOptions
  );
  const {meta, result} = data;
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Opportunities retrieved successfully",
    meta,
    data: result,
  });
});

// get all skills list

const getSkills = catchAsync(async (req: request, res: Response) => {
  const result = await opportunityServices.getSkillsList();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Skills retrieved successfully",
    data: result,
  });
});

// // get data by Opportunity id
const getOpportunityDataById = catchAsync(
  async (req: request, res: Response) => {
    console.log("req.params: ", req.params);
    const result = await opportunityServices.getDataById(
      req.params.opportunityId
    );
    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Opportunity data retrieved successfully",
      data: result,
    });
  }
);

// // updating data in the db based on petId
const updateOpportunityData = catchAsync(
  async (req: request, res: Response) => {
    console.log("user controller:", req.body, "id", req.params);

    const result = await opportunityServices.updateOpportunityInDB(
      req.params.opportunityId,
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Opportunity updated successfully",
      data: result,
    });
  }
);

// // deleting data in the db based on petId
const deleteOpportunityData = catchAsync(
  async (req: request, res: Response) => {
    console.log("user controller:", req.body, "id", req.params);

    const result = await opportunityServices.deleteOpportunityFromDB(
      req.params.opportunityId
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Pet data deleted successfully",
      data: result,
    });
  }
);

// // getting detailed data from db for admin including volunteering apps
const getDetailedData = catchAsync(async (req: request, res: Response) => {
  const result = await opportunityServices.getDetailedDataFromDb();

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Detailed data fetched successfully",
    data: result,
  });
});
export const opportunityControllers = {
  insertOpportunityData,
  getOpportunityData,
  updateOpportunityData,
  getOpportunityDataById,
  deleteOpportunityData,
  getDetailedData,
  getSkills,
};
