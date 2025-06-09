"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateConverter = dateConverter;
function dateConverter(date) {
    let currDate = new Date(date);
    let dateStr = `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`;
    return dateStr;
}
//# sourceMappingURL=date-conversion.js.map