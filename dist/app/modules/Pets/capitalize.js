"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.capitalize = void 0;
const capitalize = (value) => {
    const answer = value
        .toLowerCase()
        .replace(/(^|\s)\w/g, firstLetter => firstLetter.toUpperCase());
    console.log(answer);
    return answer;
};
exports.capitalize = capitalize;
