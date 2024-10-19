import express from "express";
import {AuthController} from "./auth.controller";
import {userRoles} from "@prisma/client";
import auth from "../../../middlewares/auth";

const router = express.Router();

// route to login user
router.post("/login", AuthController.loginUser);

// route to change password
router.put(
  "/change-password",
  auth(userRoles.Admin, userRoles.User),
  AuthController.changePasswordOfUser
);

export const AuthRoutes = router;
