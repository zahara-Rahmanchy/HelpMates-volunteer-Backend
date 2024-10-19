// import {AdoptionStatus} from "@prisma/client";
import {ApplicationStatus} from "@prisma/client";
import {z} from "zod";

const volunteerApplicationValidation = z.object({
  opportunityId: z.string({
    required_error: "opportunity Id Field value is required",
  }),
  volunteerExperience: z.string({
    required_error: "Volunteering Experience details are required",
  }),
});

const updateVolunteerAppStatus = z.object({
  body: z
    .object({
      opportunityId: z.string({
        required_error: "Opportunity Id Field value is required",
      }),
      status: z.enum([
        ApplicationStatus.APPROVED,
        ApplicationStatus.PENDING,
        ApplicationStatus.REJECTED,
      ]),
    })
    .strict(),
});

export const volunteerAppValidationSchema = {
  volunteerApplicationValidation,
  updateVolunteerAppStatus,
};
