"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidationSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const userValidation = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name field is required",
    }),
    email: zod_1.z.string({ required_error: "Email must be a valid email address" }),
    password: zod_1.z.string({
        required_error: "Password field is required",
    }),
});
const userUpdateValidation = zod_1.z.object({
    body: zod_1.z
        .object({
        id: zod_1.z.string().optional(),
        name: zod_1.z.string().optional(),
        email: zod_1.z.string().email().optional(),
        role: zod_1.z.enum([client_1.userRoles.Admin, client_1.userRoles.User]).optional(),
        active: zod_1.z.boolean().optional(),
    })
        .strict(),
});
exports.userValidationSchema = {
    userValidation,
    userUpdateValidation,
};
