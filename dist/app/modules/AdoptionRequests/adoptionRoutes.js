"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adoptionRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const adoptionController_1 = require("./adoptionController");
const adoptionValidation_1 = require("./adoptionValidation");
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
/*
post route to create adoption requests,here first auth is used to authenticate user
and then req body is validated using zod schema
*/
router.post("/adoption-request", (0, auth_1.default)(client_1.userRoles.User), (0, validateRequest_1.default)(adoptionValidation_1.adoptionRequestsValidationSchema.adoptionRequestsValidation), adoptionController_1.adoptionRequestController.insertAdoptionRequests);
/*
get route to get adoption-requests data,here first auth is used to authenticate user

*/
router.get("/adoption-requests", (0, auth_1.default)(client_1.userRoles.Admin), adoptionController_1.adoptionRequestController.getAdoptionRequests);
/**
 * get route to get user specific adoption requests
 *
 */
router.get("/my-adoption-requests", (0, auth_1.default)(client_1.userRoles.User), adoptionController_1.adoptionRequestController.getAdoptionRequestsById);
/**
 * get route to get adopted pet data,here first auth is used to authenticate user

*/
router.get("/adopted-pets", (0, auth_1.default)(client_1.userRoles.User), adoptionController_1.adoptionRequestController.getAdoptedPets);
/*
put route to update adoption status,here first auth is used to authenticate user
and then req body is validated using zod schema to ensure status field and its enumvalues
*/
router.put("/adoption-requests/:requestId", (0, auth_1.default)(client_1.userRoles.Admin), (0, validateRequest_1.default)(adoptionValidation_1.adoptionRequestsValidationSchema.updateAdoptionStatus), adoptionController_1.adoptionRequestController.updateAdoptionRequests);
exports.adoptionRequestRoutes = router;
