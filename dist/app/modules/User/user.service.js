"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.userServices = void 0;
const bcrypt = __importStar(require("bcrypt"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const client_1 = require("@prisma/client");
const ApiError_1 = __importDefault(require("../../erros/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
/**
 *
 * registers user data to the database, password is hashed and then sent to the db
 */
const createUserService = (data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("data:", data);
    const isUserPresent = yield prisma_1.default.user.findUnique({
        where: {
            email: data.email,
        },
    });
    if (isUserPresent) {
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, "User already exits", "", "A user is already registered with the email.");
    }
    const hashedPassword = yield bcrypt.hash(String(data.password), 12);
    console.log("data: ", data, "\n", { hashedPassword });
    const userData = {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: client_1.userRoles.User,
    };
    const result = yield prisma_1.default.user.create({
        data: userData,
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            password: false,
        },
    });
    return result;
});
/***
 * retrieves all the user data from the database
 */
const getUsersFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            contactNumber: true,
            role: true,
            active: true,
            createdAt: true,
            updatedAt: true,
            password: false,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });
    return result;
});
/***
 * retrieves the user data from the database
 */
const getUserProfileFromDB = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            contactNumber: true,
            createdAt: true,
            updatedAt: true,
            password: false,
        },
    });
    return result;
});
/**
 *
 *updates user data such as name and email in the db and this is ensured using zod
 */
const updateUserDataInDB = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.default.user.update({
        where: {
            id,
        },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
            password: false,
        },
    });
    console.log("updated service", { result });
    return result;
});
exports.userServices = {
    createUserService,
    getUsersFromDB,
    getUserProfileFromDB,
    updateUserDataInDB,
};
