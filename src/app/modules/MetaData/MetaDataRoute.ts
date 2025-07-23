import express from "express";

import {userRoles} from "@prisma/client";
import auth from "../../../middlewares/auth";
import {MetaController} from "./MetaDataController";

const router = express.Router();

router.get(
  "/dashboradMetaData",
  auth(userRoles.User, userRoles.Admin),
  MetaController.fetchDashboardMetaData
);

router.get(
  "/dashboradUserSignUps",
  auth(userRoles.Admin),
  MetaController.getSignUpsFromDB
);
export const MetaRoutes = router;
