"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.opportunityServices = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const opportunityConstants_1 = require("./opportunityConstants");
const opportunityUtils_1 = require("./opportunityUtils");
const ApiError_1 = __importDefault(require("../../erros/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const moment_1 = __importDefault(require("moment"));
// creates pet data in the database
const insertOpportunityDataService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("data: ", data, "\n");
    const { startDate, endDate } = data, rest = __rest(data, ["startDate", "endDate"]);
    const duration = opportunityUtils_1.opportunityUtils.calculateDurationInHours(startDate, endDate);
    console.log("duration: ", duration);
    const retrieved = opportunityUtils_1.opportunityUtils.convertDuration(duration);
    console.log("retr: ", retrieved);
    const result = yield prisma_1.default.opportunity.create({
        data: Object.assign(Object.assign({}, rest), { startDate: (0, moment_1.default)(startDate).utc().toDate(), endDate: (0, moment_1.default)(startDate).utc().toDate(), duration: duration }),
    });
    console.log("start: ", (0, moment_1.default)(startDate).local().utc().format("hh:mm A,\n MM/DD/YYYY"), "end: ", (0, moment_1.default)(endDate).local().utc().format("hh:mm A,\n MM/DD/YYYY"));
    // console.log({result});
    return result;
});
// gets pet data based on the searchTerm, filter options and also meta options
// shows total data fetched as well
const getOpportunityDataFromDB = (filters, metaOptions) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(metaOptions);
    console.log({ filters });
    const { limit, page, sortBy, sortOrder } = metaOptions;
    const { searchTerm, location, skills, start_date } = filters;
    console.log({ searchTerm });
    const pageCount = page ? page : 1;
    const dataLimit = limit ? limit : 10;
    const validOptions = sortBy && opportunityConstants_1.sortByOptions.includes(sortBy) ? sortBy : "createdAt";
    opportunityConstants_1.opportunitySearchFields.map(field => {
        console.log(field, `{${field}: {contains:searchTerm,mode:"insensitve"}}`);
    });
    const andConditions = [];
    // mapping all the field values and applying the same condiitons
    if (searchTerm) {
        andConditions.push({
            OR: opportunityConstants_1.opportunitySearchFields.map(field => {
                return {
                    [field]: {
                        contains: searchTerm,
                        mode: "insensitive",
                    },
                };
            }),
        });
    }
    if (location) {
        andConditions.push({
            location: {
                equals: location,
                mode: "insensitive",
            },
        });
    }
    if (skills) {
        andConditions.push({
            skillsRequired: {
                has: skills,
            },
        });
    }
    if (location) {
        andConditions.push({
            location: {
                equals: location,
                mode: "insensitive",
            },
        });
    }
    if (start_date) {
        andConditions.push({
            startDate: {
                gte: (0, moment_1.default)(start_date).utc().toDate(),
            },
        });
    }
    const whereConditions = { AND: andConditions };
    const result = yield prisma_1.default.opportunity.findMany({
        where: whereConditions,
        skip: Number(pageCount - 1) * dataLimit,
        take: Number(dataLimit),
        orderBy: sortBy && sortOrder
            ? {
                [validOptions.toString()]: sortOrder,
            }
            : {
                [validOptions]: "desc",
            },
    });
    console.log(validOptions.toString().toLowerCase());
    const total = yield prisma_1.default.opportunity.count({
        where: whereConditions,
        skip: page && limit ? Number(page - 1) * limit : Number(1 - 1) * 10,
        take: limit ? Number(limit) : 10,
        orderBy: sortBy && sortOrder
            ? {
                [validOptions.toString()]: sortOrder,
            }
            : {
                [validOptions]: "desc",
            },
    });
    console.log({ result }, { total });
    const meta = {
        page: Number(pageCount),
        limit: Number(dataLimit),
        total: total,
    };
    return { meta, result };
});
// // get data based on id
const getDataById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.opportunity.findUnique({
        where: {
            id,
        },
    });
    console.log("get service", { result });
    return result;
});
// // get Opportunity data along with volunteer requests and user information
const getDetailedDataFromDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.opportunity.findMany({
        include: {
            _count: {
                select: {
                    volunteerApplications: true,
                },
            },
            volunteerApplications: {
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true,
                            contactNumber: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
    return result;
});
// // updated Opportunity data based on the peId
const updateOpportunityInDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const { image: imagesArr, skillsRequired: skillsArr, startDate: start, endDate: end } = data, rest = __rest(data, ["image", "skillsRequired", "startDate", "endDate"]);
    console.log("updates: ", rest, imagesArr, skillsArr);
    // let start_date, end_date, Duration
    let start_date, end_date;
    let durations;
    const isOpportunityPresent = yield prisma_1.default.opportunity.findFirst({
        where: {
            id,
        },
        select: {
            id: true,
            image: true,
            skillsRequired: true,
            startDate: true,
            endDate: true,
        },
    });
    if (!isOpportunityPresent) {
        new ApiError_1.default(http_status_1.default.NOT_FOUND, "Opportunity not found", "", "The specified opportunity does not exist.");
    }
    // Validate dates if both start and end are given
    if (start && end) {
        const { startDate, endDate, duration } = opportunityUtils_1.opportunityUtils.validateDates((0, moment_1.default)(start).utc().toDate(), (0, moment_1.default)(end).utc().toDate());
        console.log("both dates given", startDate, endDate, duration);
        start_date = startDate;
        end_date = endDate;
        durations = duration;
    }
    // If only startDate is given, compare with DB endDate
    if (start && !end) {
        const { startDate, endDate, duration } = opportunityUtils_1.opportunityUtils.validateDates((0, moment_1.default)(start).utc().toDate(), isOpportunityPresent === null || isOpportunityPresent === void 0 ? void 0 : isOpportunityPresent.endDate);
        console.log("only startDate given: ", startDate, endDate, duration);
        start_date = startDate;
        end_date = endDate;
        durations = duration;
    }
    // If only endDate is given, compare with DB startDate
    if (!start && end) {
        const { startDate, endDate, duration } = opportunityUtils_1.opportunityUtils.validateDates(isOpportunityPresent === null || isOpportunityPresent === void 0 ? void 0 : isOpportunityPresent.startDate, (0, moment_1.default)(end).utc().toDate());
        console.log("only endDate given: ", startDate, endDate, duration);
        start_date = startDate;
        end_date = endDate;
        durations = duration;
    }
    const updates = Object.assign(Object.assign({}, rest), { startDate: start_date, endDate: end_date, duration: durations });
    if (imagesArr && imagesArr !== undefined) {
        const existingImages = isOpportunityPresent === null || isOpportunityPresent === void 0 ? void 0 : isOpportunityPresent.image;
        const newImages = imagesArr === null || imagesArr === void 0 ? void 0 : imagesArr.filter(value => !(existingImages === null || existingImages === void 0 ? void 0 : existingImages.includes(value)));
        console.log("existingImages: ", existingImages);
        console.log("newImg: ", newImages);
        if (newImages.length > 0) {
            updates["image"] = {
                push: newImages, // Use push to add new images
            };
        }
    }
    if (skillsArr && skillsArr !== undefined) {
        const existingSkills = isOpportunityPresent === null || isOpportunityPresent === void 0 ? void 0 : isOpportunityPresent.skillsRequired;
        const newSkills = skillsArr === null || skillsArr === void 0 ? void 0 : skillsArr.filter(value => !(existingSkills === null || existingSkills === void 0 ? void 0 : existingSkills.includes(value)));
        console.log("existingImages: ", existingSkills);
        console.log("newImg: ", newSkills);
        if (newSkills.length > 0) {
            updates["skillsRequired"] = {
                push: newSkills, // Use push to add new images
            };
        }
    }
    console.log("updates: ", updates);
    const result = yield prisma_1.default.opportunity.update({
        where: {
            id,
        },
        data: updates,
    });
    console.log("updated service", { result });
    return result;
});
const getSkillsList = () => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield prisma_1.default.$queryRaw `

    SELECT ARRAY(SELECT DISTINCT INITCAP(LOWER(unnest("skillsRequired"))) 
    from "opportunities" 
    WHERE "skillsRequired" 
    IS NOT NULL) as array
    `;
    console.log("skills: ", res, "\n", res[0].array);
    return res[0].array;
});
// Output unique skills
// // // delete pet data based on the peId
const deleteOpportunityFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.opportunity.delete({
        where: {
            id,
        },
    });
    console.log("deleted service", { result });
    return result;
});
exports.opportunityServices = {
    insertOpportunityDataService,
    getOpportunityDataFromDB,
    getDataById,
    updateOpportunityInDB,
    deleteOpportunityFromDB,
    getDetailedDataFromDb,
    getSkillsList,
};
// break down of the map
//  if (searchTerm) {
//   andConditions.push({
//     OR: [
//       {
//         location: {
//           contains: searchTerm,
//           mode: "insensitive",
//         },
//       },
//       {
//         organization: {
//           contains: searchTerm,
//           mode: "insensitive",
//         },
//       },
//       {
//         title: {
//           contains: searchTerm,
//           mode: "insensitive",
//         },
//       },
//     ],
//   });
// }
