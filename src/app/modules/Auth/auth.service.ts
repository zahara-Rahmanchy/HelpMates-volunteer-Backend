// import {jwtHelpers} from "../../../helpars/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";

import jwt, {JwtPayload, Secret} from "jsonwebtoken";
import ApiError from "../../erros/ApiError";
import httpStatus from "http-status";

/* while logging first comparing the passwords and then using jwt to generate token
to ensure that only logged users can access informations*/
const loginUser = async (payload: {email: string; password: string}) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });
  const isActiveUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
      active: true,
    },
  });
  if (!isActiveUser) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Sorry,Your account is deactivated!",
      "",
      ""
    );
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );
  if (!isCorrectPassword) {
    throw new Error("Password incorrect!");
  }

  const accessToken = jwt.sign(
    {
      id: userData.id,
      email: userData.email,
      contact: userData.contactNumber,
      role: userData.role,
    },
    process.env.JWT_SECRET as Secret,
    {
      algorithm: "HS256",
      expiresIn: process.env.EXPIRES_In as string,
    }
  );
  console.log({accessToken}, {userData});
  const responseData = {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    token: accessToken,
  };
  return responseData;
};

const changePassword = async (payload: {
  email: string;
  oldPassword: string;
  newPassword: string;
}) => {
  const isActiveUser = await prisma.user.findFirst({
    where: {
      email: payload.email,
      active: true,
    },
  });
  if (!isActiveUser) {
    throw new ApiError(
      httpStatus.FORBIDDEN,
      "Sorry,You cannot change password!",
      "",
      ""
    );
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.oldPassword,
    isActiveUser.password
  );
  console.log({isCorrectPassword});
  if (!isCorrectPassword) {
    throw new ApiError(
      httpStatus.UNAUTHORIZED,
      "Old password is incorrect!",
      "",
      ""
    );
  }
  const hashedPassword: string = await bcrypt.hash(
    String(payload.newPassword),
    12
  );
  await prisma.user.update({
    where: {
      id: isActiveUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  return "Changed Password";
};

export const AuthServices = {
  loginUser,
  changePassword,
};
