"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.volunteerApplicationtRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const VolunteerAppValidation_1 = require("./VolunteerAppValidation");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const client_1 = require("@prisma/client");
const VolunteerAppController_1 = require("./VolunteerAppController");
const router = express_1.default.Router();
/*
post route to create volunteer App requests,here first auth is used to authenticate user
and then req body is validated using zod schema
*/
router.post("/volunteer-application", (0, auth_1.default)(client_1.userRoles.User), (0, validateRequest_1.default)(VolunteerAppValidation_1.volunteerAppValidationSchema.volunteerApplicationValidation), VolunteerAppController_1.volunteerAppController.insertVolunteerApplication);
/*
get route to get volunteer Apps data,here first auth is used to authenticate user

*/
router.get("/allvolunteer-applications", (0, auth_1.default)(client_1.userRoles.Admin), VolunteerAppController_1.volunteerAppController.getVolunteerApplications);
// all application made to a particular opportunity
// router.get(
//   "/volunteer-applications/:id",
//   auth(userRoles.Admin),
//   volunteerAppController.getVolunteerApplications
// );
/**
 * get route to get user specific volunteer requests
 *
 */
router.get("/my-volunteer-applications", (0, auth_1.default)(client_1.userRoles.User), VolunteerAppController_1.volunteerAppController.getVolunteerApplicationsById);
/**
 * get route to get participated  data,here first auth is used to authenticate user

*/
router.get("/participated", (0, auth_1.default)(client_1.userRoles.User), VolunteerAppController_1.volunteerAppController.getVolunteeringParticipated);
/*
put route to update adoption status,here first auth is used to authenticate user
and then req body is validated using zod schema to ensure status field and its enumvalues
*/
router.put("/volunteer-application/:applicationId", (0, auth_1.default)(client_1.userRoles.Admin), (0, validateRequest_1.default)(VolunteerAppValidation_1.volunteerAppValidationSchema.updateVolunteerAppStatus), VolunteerAppController_1.volunteerAppController.updateVolunteerApplication);
exports.volunteerApplicationtRoutes = router;
