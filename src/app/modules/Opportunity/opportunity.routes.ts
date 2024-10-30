import express from "express";
// import {petControllers} from "./opportunity.controller";
import auth from "../../../middlewares/auth";
import validateRequest from "../../../middlewares/validateRequest";
// import {petValidationSchema} from "./opportunity.validation";
import {userRoles} from "@prisma/client";
import {opportunityControllers} from "./opportunity.controller";
import {opportunityValidationSchema} from "./opportunity.validation";

const router = express.Router();

/*
post route to add opportunities data,here first auth is used to authenticate user 
and then req body is validated using zod schema
*/
router.post(
  "/opportunity",
  // auth(userRoles.Admin),
  validateRequest(opportunityValidationSchema.opportunityValidationToInsert),
  opportunityControllers.insertOpportunityData
);
/*
get route to opportunities  data,here  auth is used to authenticate user so that only 
valid users can access the data
*/
router.get("/opportunities", opportunityControllers.getOpportunityData);

// get skills list for filtering
router.get("/skills", opportunityControllers.getSkills);
/*
//     get route to fetch pet data bny id ,
// */
router.get(
  "/opportunities/:opportunityId",
  // auth(userRoles.Admin, userRoles.User),
  opportunityControllers.getOpportunityDataById
);

/*
    put route to update opportunity data,here first auth is used to authenticate user 
    and then req body is validated using zod schema to ensure the valid fields
*/
router.put(
  "/opportunity/:opportunityId",
  auth(userRoles.Admin),
  validateRequest(opportunityValidationSchema.opportunityValidationToUpdate),
  opportunityControllers.updateOpportunityData
);

/**
 * route to delete pet data, only admins can
 */
router.delete(
  "/opportunity/:opportunityId",
  auth(userRoles.Admin),

  opportunityControllers.deleteOpportunityData
);

/**
 * route to get opportunity data, only admins can
 */
router.get(
  "/detailed-opportunities",
  auth(userRoles.Admin),

  opportunityControllers.getDetailedData
);
export const opportunityRoutes = router;
