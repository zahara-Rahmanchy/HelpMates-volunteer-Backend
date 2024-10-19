import {userRoles} from "@prisma/client";
import {z} from "zod";

const userValidation = z.object({
  name: z.string({
    required_error: "Name field is required",
  }),
  email: z.string({required_error: "Email must be a valid email address"}),
  password: z.string({
    required_error: "Password field is required",
  }),
});

const userUpdateValidation = z.object({
  body: z
    .object({
      id: z.string().optional(),
      name: z.string().optional(),
      email: z.string().email().optional(),
      role: z.enum([userRoles.Admin, userRoles.User]).optional(),
      active: z.boolean().optional(),
    })
    .strict(),
});

export const userValidationSchema = {
  userValidation,
  userUpdateValidation,
};
