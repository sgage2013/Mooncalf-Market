"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
require('express-async-errors');
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const csurf_1 = __importDefault(require("csurf"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const customErrors_1 = require("./errors/customErrors");
const routes_1 = __importDefault(require("./routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { environment } = require('./config');
const isProduction = environment === 'production';
const app = (0, express_1.default)();
app.use((0, morgan_1.default)('dev'));
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use(express_1.default.json());
app.use((0, csurf_1.default)({ cookie: true }));
if (!isProduction) {
    app.use((0, cors_1.default)());
}
app.use(helmet_1.default.crossOriginResourcePolicy({
    policy: "cross-origin"
}));
app.use(express_1.default.static(path_1.default.join(__dirname)));
app.use(routes_1.default);
app.get('/', (_req, res, _next) => {
    res.sendFile(path_1.default.join(__dirname, "index.html"));
});
app.get('/favicon.ico', (_req, res, _next) => {
    res.sendFile(path_1.default.join(__dirname, '/favicon.ico'));
});
app.get(/^(?!\/?api).*/, (req, res) => {
    res.cookie('XSRF-TOKEN', req.csrfToken());
    res.sendFile(path_1.default.join(__dirname, 'index.html'));
});
app.use((_req, _res, next) => {
    var _a;
    const err = new customErrors_1.NoResourceError("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    (_a = err.errors) === null || _a === void 0 ? void 0 : _a.push({ message: "The requested resource couldn't be found." });
    err.status = 404;
    next(err);
});
app.use((err, _req, _res, next) => {
    let errors = {};
    if (err.errors instanceof Array) {
        for (let error of err.errors) {
            if (error.path) {
                errors[error.path] = error.message;
            }
        }
    }
    next(err);
});
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    return res.json({
        title: isProduction ? null : err.title ? err.title : 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});
module.exports = app;
//# sourceMappingURL=app.js.map