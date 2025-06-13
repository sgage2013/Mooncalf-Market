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
const customErrors_1 = require("../../errors/customErrors");
const express = require('express');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { setTokenCookie, restoreUser } = require('../../utils/auth');
const models_1 = __importDefault(require("../../db/models"));
const { User } = models_1.default;
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();
const validateLogin = [
    check('credential')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Email or username is required'),
    check('password')
        .exists({ checkFalsy: true })
        .withMessage('Password is required'),
    handleValidationErrors
];
router.post('/login', validateLogin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { credential, password } = req.body;
    if (credential && password) {
        try {
            let user = yield User.unscoped().findOne({
                where: {
                    [Op.or]: {
                        username: credential,
                        email: credential,
                    },
                }
            });
            if (!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
                console.log("?");
                const err = new customErrors_1.LoginError('Invalid credentials', 401);
                err.status = 401;
                throw err;
            }
            yield setTokenCookie(res, user);
            let loginUser = yield user.getSafeUser();
            console.log(loginUser, "user!");
            return res.json(Object.assign({}, loginUser));
        }
        catch (e) {
            return next(e);
        }
    }
    else {
        try {
            const errors = {};
            if (!credential && !password) {
                errors.credential = "Email or username is required";
                errors.password = "Password is required";
                throw new customErrors_1.InvalidCredentialError("Please pass in a valid username/email and password", errors);
            }
            else if (!credential && password) {
                errors.credential = "Email or username is required";
                throw new customErrors_1.InvalidCredentialError("Please pass in a valid username/email", errors);
            }
            else if (credential && !password) {
                errors.password = "Password is required";
                throw new customErrors_1.InvalidCredentialError("Please pass in a valid password", errors);
            }
            else {
                errors.credential = "Server Error processing your credential";
                errors.password = "Server Error processing your password";
                throw new customErrors_1.InvalidCredentialError("There was an error submitting your form. Please Try Again", errors, 500);
            }
        }
        catch (err) {
            return next(err);
        }
    }
}));
router.get('/login', restoreUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.user) {
        const user = yield req.user.getSafeUser();
        res.json({ user });
    }
    else {
        res.json({ "user": null });
    }
}));
router.delete('/login', (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
});
module.exports = router;
//# sourceMappingURL=session.js.map