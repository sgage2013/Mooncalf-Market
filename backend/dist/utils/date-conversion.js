"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dateConverter = void 0;
function dateConverter(date) {
    let currDate = new Date(date);
    let dateStr = `${currDate.getFullYear()}-${currDate.getMonth()}-${currDate.getDate()}`;
    return dateStr;
}
exports.dateConverter = dateConverter;
//# sourceMappingURL=date-conversion.js.map