"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.volunteerAppValidationSchema = void 0;
// import {AdoptionStatus} from "@prisma/client";
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const volunteerApplicationValidation = zod_1.z.object({
    opportunityId: zod_1.z.string({
        required_error: "opportunity Id Field value is required",
    }),
    volunteerExperience: zod_1.z.string({
        required_error: "Volunteering Experience details are required",
    }),
});
const updateVolunteerAppStatus = zod_1.z.object({
    body: zod_1.z
        .object({
        opportunityId: zod_1.z.string({
            required_error: "Opportunity Id Field value is required",
        }),
        status: zod_1.z.enum([
            client_1.ApplicationStatus.APPROVED,
            client_1.ApplicationStatus.PENDING,
            client_1.ApplicationStatus.REJECTED,
        ]),
    })
        .strict(),
});
exports.volunteerAppValidationSchema = {
    volunteerApplicationValidation,
    updateVolunteerAppStatus,
};
