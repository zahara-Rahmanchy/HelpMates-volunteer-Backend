"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.opportunityRoutes = void 0;
const express_1 = __importDefault(require("express"));
// import {petControllers} from "./opportunity.controller";
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
// import {petValidationSchema} from "./opportunity.validation";
const client_1 = require("@prisma/client");
const opportunity_controller_1 = require("./opportunity.controller");
const opportunity_validation_1 = require("./opportunity.validation");
const router = express_1.default.Router();
/*
post route to add opportunities data,here first auth is used to authenticate user
and then req body is validated using zod schema
*/
router.post("/opportunity", 
// auth(userRoles.Admin),
(0, validateRequest_1.default)(opportunity_validation_1.opportunityValidationSchema.opportunityValidationToInsert), opportunity_controller_1.opportunityControllers.insertOpportunityData);
/*
get route to opportunities  data,here  auth is used to authenticate user so that only
valid users can access the data
*/
router.get("/opportunities", opportunity_controller_1.opportunityControllers.getOpportunityData);
// get skills list for filtering
router.get("/skills", opportunity_controller_1.opportunityControllers.getSkills);
/*
//     get route to fetch pet data bny id ,
// */
router.get("/opportunities/:opportunityId", 
// auth(userRoles.Admin, userRoles.User),
opportunity_controller_1.opportunityControllers.getOpportunityDataById);
/*
    put route to update opportunity data,here first auth is used to authenticate user
    and then req body is validated using zod schema to ensure the valid fields
*/
router.put("/opportunity/:opportunityId", (0, auth_1.default)(client_1.userRoles.Admin), (0, validateRequest_1.default)(opportunity_validation_1.opportunityValidationSchema.opportunityValidationToUpdate), opportunity_controller_1.opportunityControllers.updateOpportunityData);
/**
 * route to delete pet data, only admins can
 */
router.delete("/opportunity/:opportunityId", (0, auth_1.default)(client_1.userRoles.Admin), opportunity_controller_1.opportunityControllers.deleteOpportunityData);
/**
 * route to get opportunity data, only admins can
 */
router.get("/detailed-opportunities", (0, auth_1.default)(client_1.userRoles.Admin), opportunity_controller_1.opportunityControllers.getDetailedData);
exports.opportunityRoutes = router;
