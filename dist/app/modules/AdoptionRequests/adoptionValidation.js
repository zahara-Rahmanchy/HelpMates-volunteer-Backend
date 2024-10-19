"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adoptionRequestsValidationSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const adoptionRequestsValidation = zod_1.z.object({
    petId: zod_1.z.string({ required_error: "Pet Id Field value is required" }),
    petOwnershipExperience: zod_1.z.string({
        required_error: "Pet Ownership Experience is required",
    }),
});
const updateAdoptionStatus = zod_1.z.object({
    body: zod_1.z
        .object({
        petId: zod_1.z.string({ required_error: "Pet Id Field value is required" }),
        status: zod_1.z.enum([
            client_1.AdoptionStatus.APPROVED,
            client_1.AdoptionStatus.PENDING,
            client_1.AdoptionStatus.REJECTED,
        ]),
    })
        .strict(),
});
exports.adoptionRequestsValidationSchema = {
    adoptionRequestsValidation,
    updateAdoptionStatus,
};
