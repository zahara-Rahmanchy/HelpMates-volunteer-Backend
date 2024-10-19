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
exports.petControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const pet_service_1 = require("./pet.service");
const pick_1 = __importDefault(require("../../../shared/pick"));
const petConstants_1 = require("./petConstants");
// insert pet data to database
const insertPetData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user controller:", req.body);
    const result = yield pet_service_1.petServices.insertPetDataService(req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.CREATED,
        message: "Pet added successfully",
        data: result,
    });
}));
/*
get pet data from database, here searching is implemented on specfic fields
also filtering and meta options are also used to fetch data
*/
const getPetData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user controller:", req.body);
    const filtersOptions = (0, pick_1.default)(req.query, petConstants_1.petFilters);
    const metaOptions = (0, pick_1.default)(req.query, ["limit", "page", "sortBy", "sortOrder"]);
    const data = yield pet_service_1.petServices.getPetDataFromDB(filtersOptions, metaOptions);
    const { meta, result } = data;
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Pets retrieved successfully",
        meta,
        data: result,
    });
}));
// get data by pet id
const getPetDataById = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pet_service_1.petServices.getDataById(req.params.petId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Pet data retrieved successfully",
        data: result,
    });
}));
// updating data in the db based on petId
const updatePetData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user controller:", req.body, "id", req.params);
    const result = yield pet_service_1.petServices.updatePetInDB(req.params.petId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Pet profile updated successfully",
        data: result,
    });
}));
// deleting data in the db based on petId
const deletePetData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user controller:", req.body, "id", req.params);
    const result = yield pet_service_1.petServices.deletePetFromDB(req.params.petId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Pet data deleted successfully",
        data: result,
    });
}));
// deleting data in the db based on petId
const getDetailedData = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("user controller:", req.body, "id", req.params);
    const result = yield pet_service_1.petServices.getDetailedDataFromDb();
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: http_status_1.default.OK,
        message: "Detailed data fetched successfully",
        data: result,
    });
}));
exports.petControllers = {
    insertPetData,
    getPetData,
    updatePetData,
    getPetDataById,
    deletePetData,
    getDetailedData,
};
