"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("./user.controller");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../../middlewares/validateRequest"));
const user_validation_1 = require("./user.validation");
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
/*
post route to create user,herereq body is validated using zod schema and then passed
to controller
*/
router.post("/register", (0, validateRequest_1.default)(user_validation_1.userValidationSchema.userValidation), user_controller_1.userControllers.createUser);
/* get route to get all users profile where auth middleware is used to ensure
only authenticated users can access*/
router.get("/all-users", (0, auth_1.default)(client_1.userRoles.Admin), user_controller_1.userControllers.getUsers);
/* get route to get user profile where auth middleware is used to ensure
only authenticated users can access*/
router.get("/profile", (0, auth_1.default)(client_1.userRoles.User, client_1.userRoles.Admin), user_controller_1.userControllers.getUserProfile);
/*r
pute to update user profile using userId from request after ensuring valid user
through auth middleware and then validating the req body using zod scheme
*/
router.put("/profile", (0, auth_1.default)(client_1.userRoles.User, client_1.userRoles.Admin), (0, validateRequest_1.default)(user_validation_1.userValidationSchema.userUpdateValidation), user_controller_1.userControllers.updateUserData);
exports.userRoutes = router;
