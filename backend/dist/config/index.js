"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const dbFilePath = process_1.default.env.DB_FILE
    ? path_1.default.join(process_1.default.cwd(), process_1.default.env.DB_FILE)
    : path_1.default.join(process_1.default.cwd(), 'dist/db/dev.db');
module.exports = {
    environment: process_1.default.env.NODE_ENV || 'development',
    port: process_1.default.env.PORT || 8000,
    dbFile: dbFilePath,
    db: {
        username: process_1.default.env.DB_USERNAME,
        password: process_1.default.env.DB_PASSWORD,
        database: process_1.default.env.DB_DATABASE,
        schema: process_1.default.env.SCHEMA,
        host: process_1.default.env.DB_HOST
    },
    jwtConfig: {
        secret: process_1.default.env.JWT_SECRET,
        expiresIn: process_1.default.env.JWT_EXPIRES_IN
    }
};
//# sourceMappingURL=index.js.map