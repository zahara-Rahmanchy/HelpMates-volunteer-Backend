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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.volunteerAppServices = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const ApiError_1 = __importDefault(require("../../erros/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
// service to insert adoption requests data to the database along with the current user id
const insertVolunteerApplicationToDB = (data, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("data: ", data, "\n", "id:", id);
    const isUserExists = yield prisma_1.default.user.findFirst({
        where: {
            id: id,
        },
    });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exists!", "", "");
    }
    const isSameRequest = yield prisma_1.default.volunteerApplication.findFirst({
        where: {
            userId: id,
            opportunityId: data.opportunityId,
        },
    });
    console.log("isSameReq: ", isSameRequest);
    if (isSameRequest !== null) {
        throw new ApiError_1.default(http_status_1.default.CONFLICT, "Sorry,You've already made an adoption request for this pet!", "", "");
    }
    const result = yield prisma_1.default.volunteerApplication.create({
        data: Object.assign(Object.assign({}, data), { userId: id }),
    });
    console.log({ result });
    return result;
});
// service to get all adoption requests data from the database
const getVolunteerApplicationFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.volunteerApplication.findMany();
    console.log({ result });
    return result;
});
// get adoption request by users
const getVolunteerApplicationByIdFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const isUserExists = yield prisma_1.default.user.findFirst({
        where: {
            id: id,
            active: true,
        },
    });
    if (!isUserExists) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User doesn't exists!", "", "");
    }
    const result = yield prisma_1.default.volunteerApplication.findMany({
        where: {
            userId: id,
        },
        include: {
            opportunity: true,
        },
    });
    console.log({ result });
    return result;
});
// service to update adoption requests status data to the database using request id
const updateVolunteerApplicationInDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("adop updata: ", data);
    const { status, opportunityId } = data;
    // const appData = {
    //   status: status,
    // };
    const opportunityStatus = status === "APPROVED" ? client_1.OpportunityStatus.CLOSED : client_1.OpportunityStatus.OPEN;
    const result = yield prisma_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const updateAdoptReq = yield prisma.volunteerApplication.update({
            where: {
                id,
            },
            data: {
                status: status,
            },
        });
        yield prisma.opportunity.update({
            where: {
                id: opportunityId,
            },
            data: {
                status: opportunityStatus,
            },
        });
        return updateAdoptReq;
    }));
    console.log("updated service", { result });
    return result;
});
// particitpated opportunities
const getParticipatedOppFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.volunteerApplication.findMany({
        where: {
            userId: id,
            status: client_1.ApplicationStatus.APPROVED,
        },
        include: {
            opportunity: true,
        },
    });
    const currentDate = new Date();
    const newresult = yield prisma_1.default.volunteerApplication.findMany({
        where: {
            userId: id,
            status: client_1.ApplicationStatus.APPROVED,
            OR: [
                {
                    opportunity: {
                        endDate: {
                            lt: currentDate, // Completed Opportunities
                        },
                    },
                },
                {
                    opportunity: {
                        startDate: {
                            gt: currentDate, // Upcoming Opportunities
                        },
                    },
                },
            ],
        },
        include: {
            opportunity: true,
        },
    });
    console.log("new result: ", newresult);
    console.log("adopted service", { result });
    return result;
});
exports.volunteerAppServices = {
    insertVolunteerApplicationToDB,
    getVolunteerApplicationFromDB,
    updateVolunteerApplicationInDB,
    getParticipatedOppFromDB,
    getVolunteerApplicationByIdFromDB,
};
