import {OpportunityStatus} from "@prisma/client";

interface ImageUpdate {
  push: string[]; // Represents new images to be pushed into the existing array
}
interface ISkillsRequired {
  push: string[]; // Represents new images to be pushed into the existing array
}
export interface OpportunityUpdate {
  title?: string;
  image?: ImageUpdate;
  description?: string;
  location?: string;
  organization?: string;
  skillsRequired?: ISkillsRequired;
  startDate?: Date;
  endDate?: Date;
  duration?: number;
  status?: OpportunityStatus;
}
