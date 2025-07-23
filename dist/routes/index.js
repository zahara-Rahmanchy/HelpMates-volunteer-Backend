"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../app/modules/User/user.routes");
const auth_routes_1 = require("../app/modules/Auth/auth.routes");
const VolunteerAppRoutes_1 = require("../app/modules/VolunteerApplications/VolunteerAppRoutes");
const opportunity_routes_1 = require("../app/modules/Opportunity/opportunity.routes");
const MetaDataRoute_1 = require("../app/modules/MetaData/MetaDataRoute");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/",
        route: auth_routes_1.AuthRoutes,
    },
    {
        path: "/",
        route: opportunity_routes_1.opportunityRoutes,
    },
    {
        path: "/",
        route: VolunteerAppRoutes_1.volunteerApplicationtRoutes,
    },
    {
        path: "/",
        route: MetaDataRoute_1.MetaRoutes,
    },
];
moduleRoutes.forEach(route => router.use(route.path, route.route));
exports.default = router;
