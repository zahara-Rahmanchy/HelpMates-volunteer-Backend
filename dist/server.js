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
const app_1 = __importDefault(require("./app"));
const moment_1 = __importDefault(require("moment"));
const port = 5000;
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = app_1.default.listen(port, () => {
            console.log("Server running on port: ", port);
            console.log("Access the server at:", `http://${"localhost"}:${port}`);
            // Example usage:
            const localTimeInput = "2024-10-20T14:00:00";
            const utcTime = (0, moment_1.default)(localTimeInput)
                .local()
                .utc()
                .format("hh:mm A,\n MM/DD/YYYY");
            console.log((0, moment_1.default)(localTimeInput).utc().toDate());
            console.log("Local time in UTC: ", utcTime);
        });
    });
}
main();
