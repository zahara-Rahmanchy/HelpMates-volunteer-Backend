"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutRoutes = void 0;
const express_1 = __importDefault(require("express"));
const payout_controller_1 = require("./payout.controller");
const client_1 = require("@prisma/client");
const auth_1 = __importDefault(require("../../../middlewares/auth"));
const router = express_1.default.Router();
router.post("/send-payout", (0, auth_1.default)(client_1.userRoles.Admin), payout_controller_1.PayoutsController.makePaymentToVolunteers);
router.get("/getPayouts", (0, auth_1.default)(client_1.userRoles.Admin), payout_controller_1.PayoutsController.getPayoutDetails);
// http://localhost:5000/api/v1/payouts/webhook
router.post("/payouts/webhook", 
// auth(userRoles.Admin),
payout_controller_1.PayoutsController.paypalWebhook);
exports.PayoutRoutes = router;
