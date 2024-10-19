import express from "express";
import {userControllers} from "./user.controller";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/validateRequest";
import {userValidationSchema} from "./user.validation";
import {access} from "fs";
import {userRoles} from "@prisma/client";

const router = express.Router();

/*
post route to create user,herereq body is validated using zod schema and then passed 
to controller
*/
router.post(
  "/register",
  validateRequest(userValidationSchema.userValidation),
  userControllers.createUser
);

/* get route to get all users profile where auth middleware is used to ensure
only authenticated users can access*/
router.get("/all-users", auth(userRoles.Admin), userControllers.getUsers);

/* get route to get user profile where auth middleware is used to ensure
only authenticated users can access*/
router.get(
  "/profile",
  auth(userRoles.User, userRoles.Admin),
  userControllers.getUserProfile
);

/*r
pute to update user profile using userId from request after ensuring valid user
through auth middleware and then validating the req body using zod scheme
*/
router.put(
  "/profile",
  auth(userRoles.User, userRoles.Admin),
  validateRequest(userValidationSchema.userUpdateValidation),
  userControllers.updateUserData
);
export const userRoutes = router;
