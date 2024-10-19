"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.petValidationSchema = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
// validation schema for inserting pet data
const petValidationToInsert = zod_1.z.object({
    name: zod_1.z.string({
        required_error: "Name is required",
    }),
    image: zod_1.z.array(zod_1.z.string()),
    species: zod_1.z.string({
        required_error: "Species is required",
    }),
    breed: zod_1.z.string({
        required_error: "Breed is required",
    }),
    age: zod_1.z.number({
        required_error: "Age is required",
    }),
    gender: zod_1.z.string({
        required_error: "Breed is required",
    }),
    size: zod_1.z.enum([client_1.petSize.Large, client_1.petSize.Medium, client_1.petSize.Small]),
    location: zod_1.z.string({
        required_error: "Location is required",
    }),
    description: zod_1.z.string({
        required_error: "Description is required",
    }),
    temperament: zod_1.z.string({
        required_error: "Temperament is required",
    }),
    healthStatus: zod_1.z.string({
        required_error: "Health Status is required",
    }),
    adoptionRequirements: zod_1.z.string({
        required_error: "AdoptionRequirements is required",
    }),
});
// validation schema for updating pet data
const petValidationToUpdate = zod_1.z.object({
    body: zod_1.z
        .object({
        name: zod_1.z
            .string({
            required_error: "Name is required",
        })
            .optional(),
        image: zod_1.z.array(zod_1.z.string()).optional(),
        species: zod_1.z
            .string({
            required_error: "Species is required",
        })
            .optional(),
        breed: zod_1.z
            .string({
            required_error: "Breed is required",
        })
            .optional(),
        gender: zod_1.z
            .string({
            required_error: "Gender is required",
        })
            .optional(),
        age: zod_1.z
            .number({
            required_error: "Age is required",
        })
            .optional(),
        size: zod_1.z.enum([client_1.petSize.Large, client_1.petSize.Medium, client_1.petSize.Small]).optional(),
        location: zod_1.z
            .string({
            required_error: "Location is required",
        })
            .optional(),
        description: zod_1.z
            .string({
            required_error: "Description is required",
        })
            .optional(),
        temperament: zod_1.z
            .string({
            required_error: "Temperament is required",
        })
            .optional(),
        healthStatus: zod_1.z
            .string({
            required_error: "Health Status is required",
        })
            .optional(),
        adoptionRequirements: zod_1.z
            .string({
            required_error: "AdoptionRequirements is required",
        })
            .optional(),
    })
        .strict(),
});
exports.petValidationSchema = {
    petValidationToInsert,
    petValidationToUpdate,
};
