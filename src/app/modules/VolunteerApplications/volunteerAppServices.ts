import {
  ApplicationStatus,
  OpportunityStatus,
  VolunteerApplication,
} from "@prisma/client";
import prisma from "../../../shared/prisma";
import ApiError from "../../erros/ApiError";
import httpStatus from "http-status";

// service to insert adoption requests data to the database along with the current user id
const insertVolunteerApplicationToDB = async (data: any, id: string) => {
  console.log("data: ", data, "\n", "id:", id);
  const isUserExists = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });

  if (!isUserExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exists!", "", "");
  }
  const isSameRequest = await prisma.volunteerApplication.findFirst({
    where: {
      userId: id,
      opportunityId: data.opportunityId,
    },
  });
  console.log("isSameReq: ", isSameRequest);
  if (isSameRequest !== null) {
    throw new ApiError(
      httpStatus.CONFLICT,
      "Sorry,You've already made an adoption request for this pet!",
      "",
      ""
    );
  }
  const result = await prisma.volunteerApplication.create({
    data: {
      ...data,
      userId: id,
    },
  });
  console.log({result});
  return result;
};

// service to get all adoption requests data from the database
const getVolunteerApplicationFromDB = async () => {
  const result = await prisma.volunteerApplication.findMany();
  console.log({result});
  return result;
};

// get adoption request by users

const getVolunteerApplicationByIdFromDB = async (id: string) => {
  const isUserExists = await prisma.user.findFirst({
    where: {
      id: id,
      active: true,
    },
  });

  if (!isUserExists) {
    throw new ApiError(httpStatus.BAD_REQUEST, "User doesn't exists!", "", "");
  }
  const result = await prisma.volunteerApplication.findMany({
    where: {
      userId: id,
    },
    include: {
      opportunity: true,
    },
  });
  console.log({result});
  return result;
};

// service to update adoption requests status data to the database using request id
const updateVolunteerApplicationInDB = async (
  id: string,
  data: Partial<VolunteerApplication>
) => {
  console.log("adop updata: ", data);
  const {status, opportunityId} = data;
  // const appData = {
  //   status: status,
  // };
  const opportunityStatus =
    status === "APPROVED" ? OpportunityStatus.CLOSED : OpportunityStatus.OPEN;

  const result = await prisma.$transaction(async prisma => {
    const updateAdoptReq = await prisma.volunteerApplication.update({
      where: {
        id,
      },
      data: {
        status: status,
      },
    });

    await prisma.opportunity.update({
      where: {
        id: opportunityId,
      },
      data: {
        status: opportunityStatus,
      },
    });
    return updateAdoptReq;
  });

  console.log("updated service", {result});
  return result;
};

// particitpated opportunities
const getParticipatedOppFromDB = async (id: string) => {
  const result = await prisma.volunteerApplication.findMany({
    where: {
      userId: id,
      status: ApplicationStatus.APPROVED,
    },
    include: {
      opportunity: true,
    },
  });

  console.log("adopted service", {result});
  return result;
};

export const volunteerAppServices = {
  insertVolunteerApplicationToDB,
  getVolunteerApplicationFromDB,
  updateVolunteerApplicationInDB,
  getParticipatedOppFromDB,
  getVolunteerApplicationByIdFromDB,
};
