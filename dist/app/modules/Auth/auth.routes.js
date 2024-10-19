"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = express_1.default.Router();
// route to login user
router.post("/login", auth_controller_1.AuthController.loginUser);
// route to change password
router.put("/change-password", (0, auth_1.default)(client_1.userRoles.Admin, client_1.userRoles.User), auth_controller_1.AuthController.changePasswordOfUser);
exports.AuthRoutes = router;
