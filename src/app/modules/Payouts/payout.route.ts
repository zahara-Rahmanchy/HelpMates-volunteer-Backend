import express from "express";
import { PayoutsController } from "./payout.controller";
import { userRoles } from "@prisma/client";
import auth from "../../../middlewares/auth";

const router = express.Router();

router.post(
  "/send-payout",
  //  auth(userRoles.Admin),
  PayoutsController.makePaymentToVolunteers
  
);

router.get("/getPayouts", 
  // auth(userRoles.Admin),
  PayoutsController.getPayoutDetails
)

router.post("/payouts/webhook",
  // auth(userRoles.Admin),
  PayoutsController.paypalWebhook);
export const PayoutRoutes = router