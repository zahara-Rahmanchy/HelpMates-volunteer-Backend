"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.petRoutes = void 0;
const express_1 = __importDefault(require("express"));
const pet_controller_1 = require("./pet.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const pet_validation_1 = require("./pet.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
/*
post route to add pet data,here first auth is used to authenticate user
and then req body is validated using zod schema
*/
router.post("/pets", (0, auth_1.default)(client_1.userRoles.Admin), (0, validateRequest_1.default)(pet_validation_1.petValidationSchema.petValidationToInsert), pet_controller_1.petControllers.insertPetData);
/*
get route to get pet data,here  auth is used to authenticate user so that only
valid users can access the data
*/
router.get("/pets", pet_controller_1.petControllers.getPetData);
/*
    get route to fetch pet data bny id ,
*/
router.get("/pets/:petId", (0, auth_1.default)(client_1.userRoles.Admin, client_1.userRoles.User), pet_controller_1.petControllers.getPetDataById);
/*
    put route to update pet data,here first auth is used to authenticate user
    and then req body is validated using zod schema to ensure the valid fields
*/
router.put("/pets/:petId", (0, auth_1.default)(client_1.userRoles.Admin), (0, validateRequest_1.default)(pet_validation_1.petValidationSchema.petValidationToUpdate), pet_controller_1.petControllers.updatePetData);
/**
 * route to delete pet data, only admins can
 */
router.delete("/pet/:petId", (0, auth_1.default)(client_1.userRoles.Admin), pet_controller_1.petControllers.deletePetData);
/**
 * route to get pet data, only admins can
 */
router.get("/detailed-pets", (0, auth_1.default)(client_1.userRoles.Admin), pet_controller_1.petControllers.getDetailedData);
exports.petRoutes = router;
