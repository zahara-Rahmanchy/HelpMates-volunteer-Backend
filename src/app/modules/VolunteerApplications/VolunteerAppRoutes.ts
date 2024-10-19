import express from "express";
import auth from "../../../middlewares/auth";
import {volunteerAppValidationSchema} from "./VolunteerAppValidation";
import validateRequest from "../../../middlewares/validateRequest";
import {userRoles} from "@prisma/client";
import {volunteerAppController} from "./VolunteerAppController";

const router = express.Router();

/*
post route to create volunteer App requests,here first auth is used to authenticate user 
and then req body is validated using zod schema
*/
router.post(
  "/volunteer-application",
  auth(userRoles.User),
  validateRequest(volunteerAppValidationSchema.volunteerApplicationValidation),
  volunteerAppController.insertVolunteerApplication
);
/*
get route to get volunteer Apps data,here first auth is used to authenticate user 

*/
router.get(
  "/allvolunteer-applications",
  auth(userRoles.Admin),
  volunteerAppController.getVolunteerApplications
);
/**
 * get route to get user specific volunteer requests
 *
 */
router.get(
  "/my-volunteer-applications",
  auth(userRoles.User),
  volunteerAppController.getVolunteerApplicationsById
);

/**
 * get route to get participated  data,here first auth is used to authenticate user 

*/
router.get(
  "/participated",
  auth(userRoles.User),
  volunteerAppController.getVolunteeringParticipated
);

/*
put route to update adoption status,here first auth is used to authenticate user 
and then req body is validated using zod schema to ensure status field and its enumvalues
*/
router.put(
  "/volunteer-application/:applicationId",
  auth(userRoles.Admin),
  validateRequest(volunteerAppValidationSchema.updateVolunteerAppStatus),
  volunteerAppController.updateVolunteerApplication
);

export const volunteerApplicationtRoutes = router;
