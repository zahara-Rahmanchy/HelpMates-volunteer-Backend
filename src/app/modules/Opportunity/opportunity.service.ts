import * as bcrypt from "bcrypt";
import prisma from "../../../shared/prisma";

import {opportunitySearchFields, sortByOptions} from "./opportunityConstants";
import {capitalize} from "./capitalize";
import {date, number} from "zod";
import {equal} from "assert";
import {opportunityUtils} from "./opportunityUtils";
import {Opportunity, Prisma} from "@prisma/client";
import ApiError from "../../erros/ApiError";
import httpStatus from "http-status";
import {OpportunityUpdate} from "./opportunityInterfaces";

// creates pet data in the database
const insertOpportunityDataService = async (data: any) => {
  console.log("data: ", data, "\n");
  const {startDate, endDate, ...rest} = data;
  const duration = opportunityUtils.calculateDurationInHours(
    startDate,
    endDate
  );
  console.log("duration: ", duration);
  const retrieved = opportunityUtils.convertDuration(duration);
  console.log("retr: ", retrieved);
  const result = await prisma.opportunity.create({
    data: {
      ...rest,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      duration: duration,
    },
  });
  // console.log({result});
  return result;
};

// gets pet data based on the searchTerm, filter options and also meta options
// shows total data fetched as well
const getOpportunityDataFromDB = async (filters: any, metaOptions: any) => {
  console.log(metaOptions);
  console.log({filters});
  const {limit, page, sortBy, sortOrder} = metaOptions;
  const {searchTerm, location, skills, start_date} = filters;
  console.log({searchTerm});

  const pageCount = page ? page : 1;
  const dataLimit = limit ? limit : 10;
  const validOptions =
    sortBy && sortByOptions.includes(sortBy) ? sortBy : "createdAt";

  opportunitySearchFields.map(field => {
    console.log(field, `{${field}: {contains:searchTerm,mode:"insensitve"}}`);
  });
  const andConditions: Prisma.OpportunityWhereInput[] = [];

  // mapping all the field values and applying the same condiitons
  if (searchTerm) {
    andConditions.push({
      OR: opportunitySearchFields.map(field => {
        return {
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  if (location) {
    andConditions.push({
      location: {
        equals: location,
        mode: "insensitive",
      },
    });
  }
  if (skills) {
    andConditions.push({
      skillsRequired: {
        has: skills,
      },
    });
  }
  if (location) {
    andConditions.push({
      location: {
        equals: location,
        mode: "insensitive",
      },
    });
  }
  if (start_date) {
    andConditions.push({
      startDate: {
        gte: new Date(start_date),
      },
    });
  }

  const whereConditions: Prisma.OpportunityWhereInput = {AND: andConditions};
  const result = await prisma.opportunity.findMany({
    where: whereConditions,
    skip: Number(pageCount - 1) * dataLimit,
    take: Number(dataLimit),
    orderBy:
      sortBy && sortOrder
        ? {
            [validOptions.toString()]: sortOrder,
          }
        : {
            [validOptions]: "desc",
          },
  });
  console.log(validOptions.toString().toLowerCase());
  const total = await prisma.opportunity.count({
    where: whereConditions,
    skip: page && limit ? Number(page - 1) * limit : Number(1 - 1) * 10,
    take: limit ? Number(limit) : 10,
    orderBy:
      sortBy && sortOrder
        ? {
            [validOptions.toString()]: sortOrder,
          }
        : {
            [validOptions]: "desc",
          },
  });
  console.log({result}, {total});

  const meta = {
    page: Number(pageCount),
    limit: Number(dataLimit),
    total: total,
  };

  return {meta, result};
};

// // get data based on id

const getDataById = async (id: string) => {
  const result = await prisma.opportunity.findUnique({
    where: {
      id,
    },
  });
  console.log("get service", {result});
  return result;
};

// // get Opportunity data along with adoption requests and user information
const getDetailedDataFromDb = async () => {
  const result = await prisma.opportunity.findMany({
    include: {
      _count: {
        select: {
          volunteerApplications: true,
        },
      },
      volunteerApplications: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              contactNumber: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return result;
};
// // updated Opportunity data based on the peId
const updateOpportunityInDB = async (
  id: string,
  data: Partial<Opportunity>
) => {
  const {
    image: imagesArr,
    skillsRequired: skillsArr,
    startDate: start,
    endDate: end,
    ...rest
  } = data;
  console.log("updates: ", rest, imagesArr, skillsArr);
  // let start_date, end_date, Duration
  let start_date, end_date;
  let durations;
  const isOpportunityPresent = await prisma.opportunity.findFirst({
    where: {
      id,
    },
    select: {
      id: true,
      image: true,
      skillsRequired: true,
      startDate: true,
      endDate: true,
    },
  });

  if (!isOpportunityPresent) {
    new ApiError(
      httpStatus.NOT_FOUND,
      "Opportunity not found",
      "",
      "The specified opportunity does not exist."
    );
  }

  // Validate dates if both start and end are given

  if (start && end) {
    const {startDate, endDate, duration} = opportunityUtils.validateDates(
      new Date(start),
      new Date(end)
    );
    console.log("both dates given", startDate, endDate, duration);
    start_date = startDate;
    end_date = endDate;
    durations = duration;
  }

  // If only startDate is given, compare with DB endDate
  if (start && !end) {
    // startDate = new Date(start);
    // if (
    //   isOpportunityPresent?.endDate &&
    //   startDate >= isOpportunityPresent?.endDate
    // ) {
    //   throw new Error("startDate must be earlier than the existing endDate.");
    // }
    // duration = opportunityUtils.calculateDurationInHours(
    //   String(start),
    //   String(end)
    // );

    const {startDate, endDate, duration} = opportunityUtils.validateDates(
      new Date(start),
      isOpportunityPresent?.endDate as Date
    );
    console.log("only startDate given: ", startDate, endDate, duration);
    start_date = startDate;
    end_date = endDate;
    durations = duration;
  }

  // If only endDate is given, compare with DB startDate
  if (!start && end) {
    const {startDate, endDate, duration} = opportunityUtils.validateDates(
      isOpportunityPresent?.startDate as Date,
      new Date(end)
    );
    console.log("only endDate given: ", startDate, endDate, duration);
    start_date = startDate;
    end_date = endDate;
    durations = duration;
  }
  const updates: OpportunityUpdate = {
    ...rest,
    startDate: start_date,
    endDate: end_date,
    duration: durations,
  };
  if (imagesArr && imagesArr !== undefined) {
    const existingImages = isOpportunityPresent?.image;
    const newImages = imagesArr?.filter(
      value => !existingImages?.includes(value)
    );
    console.log("existingImages: ", existingImages);
    console.log("newImg: ", newImages);
    if (newImages.length > 0) {
      updates["image"] = {
        push: newImages, // Use push to add new images
      };
    }
  }
  if (skillsArr && skillsArr !== undefined) {
    const existingSkills = isOpportunityPresent?.skillsRequired;
    const newSkills = skillsArr?.filter(
      value => !existingSkills?.includes(value)
    );
    console.log("existingImages: ", existingSkills);
    console.log("newImg: ", newSkills);
    if (newSkills.length > 0) {
      updates["skillsRequired"] = {
        push: newSkills, // Use push to add new images
      };
    }
  }

  console.log("updates: ", updates);
  const result = await prisma.opportunity.update({
    where: {
      id,
    },
    data: updates,
  });
  console.log("updated service", {result});
  return result;
};

// // // delete pet data based on the peId
const deleteOpportunityFromDB = async (id: string) => {
  const result = await prisma.opportunity.delete({
    where: {
      id,
    },
  });
  console.log("deleted service", {result});
  return result;
};

export const opportunityServices = {
  insertOpportunityDataService,
  getOpportunityDataFromDB,
  getDataById,
  updateOpportunityInDB,
  deleteOpportunityFromDB,
  getDetailedDataFromDb,
};

// break down of the map
//  if (searchTerm) {
//   andConditions.push({
//     OR: [
//       {
//         location: {
//           contains: searchTerm,
//           mode: "insensitive",
//         },
//       },
//       {
//         organization: {
//           contains: searchTerm,
//           mode: "insensitive",
//         },
//       },
//       {
//         title: {
//           contains: searchTerm,
//           mode: "insensitive",
//         },
//       },
//     ],
//   });
// }
