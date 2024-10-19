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
const catchAsync_1 = __importDefault(require("../shared/catchAsync"));
const http_status_1 = __importDefault(require("http-status"));
const jwtHelpers_1 = require("../app/helpers/jwtHelpers");
const ApiError_1 = __importDefault(require("../app/erros/ApiError"));
/**
 * verifies the user based on the token
 *
 */
const auth = (...requiredRoles) => {
    // eslint-disable-next-line no-unused-vars
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("headers", req.headers);
        const token = req.headers.authorization;
        // check if the token is not available
        if (!token) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "", "You do not have permission to access this information");
        }
        const verifiedUser = jwtHelpers_1.jwtHelpers.verifyToken(token, process.env.JWT_SECRET);
        const { exp } = verifiedUser;
        if (Math.floor(Date.now() / 1000) >= Number(verifiedUser === null || verifiedUser === void 0 ? void 0 : verifiedUser.exp)) {
            throw new ApiError_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized Access", "", "You do not have permission to access");
        }
        req.user = verifiedUser; // role  , userid
        // role diye guard korar jnno
        if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
            throw new ApiError_1.default(http_status_1.default.FORBIDDEN, "Forbidden", "", "This path is forbidden");
        }
        next();
    }));
};
exports.default = auth;
