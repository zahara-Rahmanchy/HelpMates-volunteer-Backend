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
exports.AuthServices = void 0;
// import {jwtHelpers} from "../../../helpars/jwtHelpers";
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ApiError_1 = __importDefault(require("../../erros/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
/* while logging first comparing the passwords and then using jwt to generate token
to ensure that only logged users can access informations*/
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });
    const isActiveUser = yield prisma_1.default.user.findFirst({
        where: {
            email: payload.email,
            active: true,
        },
    });
    if (!isActiveUser) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Sorry,Your account is deactivated!", "", "");
    }
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect!");
    }
    const accessToken = jsonwebtoken_1.default.sign({
        id: userData.id,
        email: userData.email,
        contact: userData.contactNumber,
        role: userData.role,
    }, process.env.JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: process.env.EXPIRES_In,
    });
    console.log({ accessToken }, { userData });
    const responseData = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        token: accessToken,
    };
    return responseData;
});
const changePassword = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const isActiveUser = yield prisma_1.default.user.findFirst({
        where: {
            email: payload.email,
            active: true,
        },
    });
    if (!isActiveUser) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Sorry,You cannot change password!", "", "");
    }
    const isCorrectPassword = yield bcrypt.compare(payload.oldPassword, isActiveUser.password);
    console.log({ isCorrectPassword });
    if (!isCorrectPassword) {
        throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Old password is incorrect!", "", "");
    }
    const hashedPassword = yield bcrypt.hash(String(payload.newPassword), 12);
    yield prisma_1.default.user.update({
        where: {
            id: isActiveUser.id,
        },
        data: {
            password: hashedPassword,
        },
    });
    return "Changed Password";
});
exports.AuthServices = {
    loginUser,
    changePassword,
};
