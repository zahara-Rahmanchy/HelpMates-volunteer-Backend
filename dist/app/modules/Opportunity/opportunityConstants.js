"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sortByOptions = exports.opportunitySearchFields = exports.opportunityFilters = void 0;
exports.opportunityFilters = [
    "location",
    "skills",
    "start_date",
    "searchTerm",
];
// this will be used in services
exports.opportunitySearchFields = ["location", "organization", "title"];
exports.sortByOptions = ["duration", "start_date", "createdAt"];
// filter location, skills or start_date,
//  and searching can be done using location,organization, titile
//  sorting using duration or start_date, default createdAt
