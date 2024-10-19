"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_1 = __importDefault(require("http-status"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.send({
        Message: "Pet Adoption System",
    });
});
app.use("/api", routes_1.default);
// global error handler middleware used for handling all the errors and providing details
app.use(globalErrorHandler_1.default);
// this one is used for not found route
app.use((req, res, next) => {
    res.status(http_status_1.default.NOT_FOUND).json({
        success: false,
        message: "API NOT FOUND!",
        errorDetails: {
            path: req.originalUrl,
            error: "Your requested path is not found!",
        },
    });
});
exports.default = app;
