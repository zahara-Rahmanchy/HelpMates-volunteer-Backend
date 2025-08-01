import express from "express";
import {userRoutes} from "../app/modules/User/user.routes";
import {AuthRoutes} from "../app/modules/Auth/auth.routes";

import {volunteerApplicationtRoutes} from "../app/modules/VolunteerApplications/VolunteerAppRoutes";
import {opportunityRoutes} from "../app/modules/Opportunity/opportunity.routes";
import {MetaRoutes} from "../app/modules/MetaData/MetaDataRoute";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/",
    route: userRoutes,
  },
  {
    path: "/",
    route: AuthRoutes,
  },
  {
    path: "/",
    route: opportunityRoutes,
  },
  {
    path: "/",
    route: volunteerApplicationtRoutes,
  },
  {
    path: "/",
    route: MetaRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
