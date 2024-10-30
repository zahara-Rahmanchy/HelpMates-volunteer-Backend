"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.opportunityUtils = void 0;
const moment_1 = __importDefault(require("moment"));
function convertDuration(durationInHours) {
    // Constants for time conversions
    const hoursInDay = 24;
    const daysInWeek = 7;
    const daysInMonth = 30;
    // Calculate months, weeks, days, and remaining hours
    const months = Math.floor(durationInHours / (hoursInDay * daysInMonth));
    const remainingAfterMonths = durationInHours % (hoursInDay * daysInMonth);
    const weeks = Math.floor(remainingAfterMonths / (hoursInDay * daysInWeek));
    const remainingAfterWeeks = remainingAfterMonths % (hoursInDay * daysInWeek);
    const days = Math.floor(remainingAfterWeeks / hoursInDay);
    const hours = remainingAfterWeeks % hoursInDay;
    // Create the output parts dynamically
    const parts = [
        months > 0 ? `${months} month${months > 1 ? "s" : ""}` : "",
        weeks > 0 ? `${weeks} week${weeks > 1 ? "s" : ""}` : "",
        days > 0 ? `${days} day${days > 1 ? "s" : ""}` : "",
        hours > 0 ? `${hours} hour${hours > 1 ? "s" : ""}` : "",
    ].filter(Boolean); // Filter out empty strings
    return parts.length > 0 ? parts.join(", ") : "0 hours";
}
const calculateDurationInHours = (startDate, endDate) => {
    const startMoment = (0, moment_1.default)(startDate);
    const endMoment = (0, moment_1.default)(endDate);
    const diffInMilliseconds = endMoment.diff(startMoment);
    const diffInHours = moment_1.default.duration(diffInMilliseconds).asHours();
    return diffInHours; // Convert to hours
};
const validateDates = (startDate, endDate) => {
    // startDate = new Date(start);
    // endDate = new Date(end);
    if (startDate >= endDate) {
        throw new Error("startDate cannot be greater than or equal to endDate.");
    }
    const duration = exports.opportunityUtils.calculateDurationInHours(startDate, endDate);
    return { startDate, endDate, duration };
};
exports.opportunityUtils = {
    convertDuration,
    calculateDurationInHours,
    validateDates,
};
