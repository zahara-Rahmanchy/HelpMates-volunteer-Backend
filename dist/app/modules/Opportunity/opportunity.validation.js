"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.opportunityValidationSchema = void 0;
const zod_1 = require("zod");
// validation schema for inserting opportunity data
// const opportunityValidationToInsert = z.object({
//   body: z
//     .object({
//       title: z.string().min(1, "Title is required."),
//       image: z.array(z.string()).min(1, "At least one image is required."),
//       description: z.string().min(100, "Detailed description is required."),
//       location: z.string().min(1, "Location is required."),
//       organization: z.string().min(1, "Organization is required."),
//       skillsRequired: z
//         .array(z.string())
//         .min(1, "At least one skill is required."),
//       startDate: z.string().datetime({
//         message: "Start date must be a valid datetime.",
//       }),
//       endDate: z.string().datetime({
//         message: "End date must be a valid datetime.",
//       }),
//     })
//     .strict()
//     .refine(
//       data => {
//         const startDate = new Date(data.startDate);
//         const endDate = new Date(data.endDate);
//         return endDate > startDate; // Ensure endDate is after startDate
//       },
//       {
//         message: "End date must be after the start date",
//         path: ["endDate"], // This sets the error to the endDate field
//       }
//     ),
// });
const opportunityValidationToInsert = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z.string().min(1, "Title is required."),
        image: zod_1.z.array(zod_1.z.string()).min(1, "At least one image is required."),
        description: zod_1.z.string().min(100, "Detailed description is required."),
        benefit: zod_1.z.string({ required_error: "Benefit is required." }),
        location: zod_1.z.string().min(1, "Location is required."),
        organization: zod_1.z.string().min(1, "Organization is required."),
        skillsRequired: zod_1.z
            .array(zod_1.z.string())
            .min(1, "At least one skill is required."),
        startDate: zod_1.z.string().datetime({
            message: "Start date must be a valid datetime.",
        }),
        endDate: zod_1.z.string().datetime({
            message: "Start date must be a valid datetime.",
        }),
    })
        .strict()
        .refine(data => {
        const { startDate, endDate } = data;
        console.log("data: ", data);
        return new Date(endDate) > new Date(startDate); // Validate the condition
    }, {
        message: "End date must be greater than the start date",
        path: ["endDate"], // Link the error to endDate
    }),
});
// validation schema for updating opportunity data
const opportunityValidationToUpdate = zod_1.z.object({
    body: zod_1.z
        .object({
        title: zod_1.z
            .string({
            required_error: "Title is required",
        })
            .optional(), // Optional for updates
        image: zod_1.z.array(zod_1.z.string()).optional(), // Optional for updates
        description: zod_1.z
            .string({
            required_error: "Description is required",
        })
            .optional(),
        location: zod_1.z
            .string({
            required_error: "Location is required",
        })
            .optional(),
        benefit: zod_1.z
            .string({
            required_error: "benefit is required",
        })
            .optional(),
        organization: zod_1.z
            .string({
            required_error: "Organization is required",
        })
            .optional(),
        skillsRequired: zod_1.z.array(zod_1.z.string()).min(1).optional(), // Optional, but must contain at least 1 if provided
        startDate: zod_1.z.string().optional(), // Optional with date format validation
        endDate: zod_1.z.string().optional(), // Optional with date format validation
        status: zod_1.z.enum(["OPEN", "CLOSED"]).optional(), // Optional status
    })
        .strict()
        .refine(data => {
        const { startDate, endDate } = data;
        if (startDate && endDate) {
            return new Date(endDate) > new Date(startDate);
        }
        return true; // If one or both are missing, we don't need to validate
    }, {
        message: "End date must be greater than the start date",
        path: ["endDate"], // This sets the error to the endDate field
    }),
});
exports.opportunityValidationSchema = {
    opportunityValidationToInsert,
    opportunityValidationToUpdate,
};
