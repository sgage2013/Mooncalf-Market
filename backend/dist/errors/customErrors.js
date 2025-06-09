"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidCredentialError = exports.ForbiddenError = exports.UnauthorizedError = exports.AuthError = exports.SequelizeError = exports.LoginError = exports.NoResourceError = void 0;
const sequelize_1 = require("sequelize");
class NoResourceError extends Error {
    constructor(message, status, title, errors) {
        super(message);
        this.status = status;
        this.title = title;
        this.errors = errors;
    }
}
exports.NoResourceError = NoResourceError;
class LoginError extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
exports.LoginError = LoginError;
class SequelizeError extends sequelize_1.ValidationError {
    constructor(message, errors, options) {
        super(message, errors);
        this.options = options;
    }
}
exports.SequelizeError = SequelizeError;
class AuthError extends Error {
    constructor(message) {
        super(message);
    }
}
exports.AuthError = AuthError;
class UnauthorizedError extends Error {
    constructor(message, status = 401) {
        super(message);
        this.status = status;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends Error {
    constructor(message, status = 403) {
        super(message);
        this.status = status;
    }
}
exports.ForbiddenError = ForbiddenError;
class InvalidCredentialError extends Error {
    constructor(message, errors, status = 400) {
        super(message);
        this.message = message;
        this.errors = errors;
        this.status = status;
    }
}
exports.InvalidCredentialError = InvalidCredentialError;
//# sourceMappingURL=customErrors.js.map