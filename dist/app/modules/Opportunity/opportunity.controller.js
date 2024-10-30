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
exports.opportunityControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const opportunity_service_1 = require("./opportunity.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const opportunityConstants_1 = require("./opportunityConstants");
// insert Opportunity data to database
const insertOpportunityData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user controller:", req.body);
    const result = yield opportunity_service_1.opportunityServices.insertOpportunityDataService(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Volunteering opportunity added successfully",
        data: result,
    });
}));
/*
get Opportunity data from database, here searching is implemented on specfic fields
also filtering and meta options are also used to fetch data
*/
const getOpportunityData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("user controller:", req.body);
    console.log("req.query: ", req.query);
    const filtersOptions = (0, pick_1.default)(req.query, opportunityConstants_1.opportunityFilters);
    const metaOptions = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const data = yield opportunity_service_1.opportunityServices.getOpportunityDataFromDB(filtersOptions, metaOptions);
    const { meta, result } = data;
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Opportunities retrieved successfully",
        meta,
        data: result,
    });
}));
// get all skills list
const getSkills = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield opportunity_service_1.opportunityServices.getSkillsList();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Skills retrieved successfully",
        data: result,
    });
}));
// // get data by Opportunity id
const getOpportunityDataById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.params: ", req.params);
    const result = yield opportunity_service_1.opportunityServices.getDataById(req.params.opportunityId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Opportunity data retrieved successfully",
        data: result,
    });
}));
// // updating data in the db based on petId
const updateOpportunityData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user controller:", req.body, "id", req.params);
    const result = yield opportunity_service_1.opportunityServices.updateOpportunityInDB(req.params.opportunityId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Opportunity updated successfully",
        data: result,
    });
}));
// // deleting data in the db based on petId
const deleteOpportunityData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user controller:", req.body, "id", req.params);
    const result = yield opportunity_service_1.opportunityServices.deleteOpportunityFromDB(req.params.opportunityId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Pet data deleted successfully",
        data: result,
    });
}));
// // getting detailed data from db for admin including volunteering apps
const getDetailedData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield opportunity_service_1.opportunityServices.getDetailedDataFromDb();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Detailed data fetched successfully",
        data: result,
    });
}));
exports.opportunityControllers = {
    insertOpportunityData,
    getOpportunityData,
    updateOpportunityData,
    getOpportunityDataById,
    deleteOpportunityData,
    getDetailedData,
    getSkills,
};
