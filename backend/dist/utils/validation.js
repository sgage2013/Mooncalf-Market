"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQueryParams = exports.handleValidationErrors = void 0;
const customErrors_1 = require("../errors/customErrors");
const { validationResult, check } = require('express-validator');
const handleValidationErrors = (req, _res, next) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        const errors = {};
        validationErrors
            .array()
            .forEach((error) => errors[error.path] = error.msg);
        const err = new customErrors_1.AuthError("Bad request.");
        err.errors = errors;
        err.status = 400;
        err.title = "Bad request.";
        next(err);
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
exports.validateQueryParams = [
    check('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Page must be greater than or equal to 1"),
    check('size')
        .optional()
        .isInt({ min: 1 })
        .withMessage("Size must be greater than or equal to 1"),
    check('minLat')
        .optional()
        .isFloat({ min: -90 })
        .withMessage("Minimum latitude is invalid"),
    check('maxLat')
        .optional()
        .isFloat({ max: 90 })
        .withMessage("Maximum latitude is invalid"),
    check('minLng')
        .optional()
        .isFloat({ min: -180 })
        .withMessage("Minimum longitude is invalid"),
    check('maxLng')
        .optional()
        .isFloat({ max: 180 })
        .withMessage("Maximum longitude is invalid"),
    check('minPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum price must be greater than or equal to 0"),
    check('maxPrice')
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Maximum price must be greater than or equal to 0"),
    exports.handleValidationErrors
];
module.exports = {
    handleValidationErrors: exports.handleValidationErrors,
    validateQueryParams: exports.validateQueryParams
};
//# sourceMappingURL=validation.js.map