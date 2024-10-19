"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiError extends Error {
    constructor(statusCode, message, stack = "", error) {
        super(message);
        this.statusCode = statusCode;
        this.error = error;
        if (stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
            console.log(" Error.captureStackTrace(this,this.constructor): ", Error.captureStackTrace(this, this.constructor));
        }
    }
}
exports.default = ApiError;
