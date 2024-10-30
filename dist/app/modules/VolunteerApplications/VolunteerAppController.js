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
exports.volunteerAppController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const volunteerAppServices_1 = require("./volunteerAppServices");
// insert VolunteerApplication to database along with the current userId received from req.userId
const insertVolunteerApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("adopt controller:", req.body, req.user);
    const result = yield volunteerAppServices_1.volunteerAppServices.insertVolunteerApplicationToDB(req.body, String((_a = req.user) === null || _a === void 0 ? void 0 : _a.id));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Volunteering application request submitted successfully",
        data: result,
    });
}));
// get VolunteerApplications database
const getVolunteerApplications = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield volunteerAppServices_1.volunteerAppServices.getVolunteerApplicationFromDB();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Volunteer Applications retrieved successfully",
        data: result,
    });
}));
// get applications by opportunity id
/*
  get VolunteerApplication made by specific user
*/
const getVolunteerApplicationsById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    console.log("req.user: ", req.user);
    const result = yield volunteerAppServices_1.volunteerAppServices.getVolunteerApplicationByIdFromDB(String((_b = req.user) === null || _b === void 0 ? void 0 : _b.id));
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Volunteer Applications retrieved successfully",
        data: result,
    });
}));
// updating adoption data in the db based on the requestId
const updateVolunteerApplication = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user controller:", req.body, "id", req.params);
    const result = yield volunteerAppServices_1.volunteerAppServices.updateVolunteerApplicationInDB(req.params.applicationId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Volunteer application updated successfully",
        data: result,
    });
}));
// get Volunteering opportunities participated from database
const getVolunteeringParticipated = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const result = yield volunteerAppServices_1.volunteerAppServices.getParticipatedOppFromDB(String((_c = req === null || req === void 0 ? void 0 : req.user) === null || _c === void 0 ? void 0 : _c.id));
    if (result.length === 0) {
        return (0, sendResponse_1.default)(res, {
            success: true,
            statusCode: http_status_1.default.OK,
            message: "Not partcipated in any volunteering events yet!",
            data: result,
        });
    }
    return (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Volunteering opportunities participated retrieved successfully",
        data: result,
    });
}));
exports.volunteerAppController = {
    insertVolunteerApplication,
    getVolunteerApplications,
    getVolunteerApplicationsById,
    getVolunteeringParticipated,
    updateVolunteerApplication,
};
