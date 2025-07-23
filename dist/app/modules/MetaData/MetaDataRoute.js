"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaRoutes = void 0;
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const MetaDataController_1 = require("./MetaDataController");
const router = express_1.default.Router();
router.get("/dashboradMetaData", (0, auth_1.default)(client_1.userRoles.User, client_1.userRoles.Admin), MetaDataController_1.MetaController.fetchDashboardMetaData);
router.get("/dashboradUserSignUps", (0, auth_1.default)(client_1.userRoles.Admin), MetaDataController_1.MetaController.getSignUpsFromDB);
exports.MetaRoutes = router;
