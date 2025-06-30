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
const auth_1 = require("../../utils/auth");
const validation_1 = require("../../utils/validation");
const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const models_1 = __importDefault(require("../../db/models"));
const customErrors_1 = require("../../errors/customErrors");
const { User, UserImage } = models_1.default;
const router = require("express").Router();
const validateSignup = [
    check("email").isEmail().withMessage("Please provide a valid email."),
    check("username")
        .isLength({ min: 4 })
        .withMessage("Please provide a username with at least 4 characters."),
    check("username").not().isEmail().withMessage("Username cannot be an email."),
    check("password")
        .isLength({ min: 6 })
        .withMessage("Password must be 6 characters or more."),
    validation_1.handleValidationErrors,
];
router.post("/signup", validateSignup, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, username, isHost } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    let existingUser = yield User.findOne({
        where: {
            [Op.or]: {
                username,
                email,
            },
        },
    });
    if (existingUser) {
        if (existingUser)
            existingUser = existingUser.toJSON();
        let errors = {};
        if (existingUser.email === email) {
            errors["email"] = "User with that email already exists";
        }
        if (existingUser.username === username) {
            errors["username"] = "User with that username already exists";
        }
        res.status(500);
        return res.json({ message: "User already exists", errors });
    }
    else {
        try {
            const user = yield User.create({
                firstName,
                lastName,
                email,
                username,
                hashedPassword,
                isHost: isHost || false,
            });
            const safeUser = yield user.getSafeUser();
            yield (0, auth_1.setTokenCookie)(res, safeUser);
            return res.json(Object.assign({}, safeUser));
        }
        catch (e) {
            console.log(e);
            return next(e);
        }
    }
}));
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User.findAll({
        include: {
            model: UserImage,
        },
    });
    res.json(users);
}));
router.delete("/profile", auth_1.validateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.user.id;
        if (userId !== String(userId)) {
            const user = yield User.findByPk(userId);
            if (!user)
                throw new customErrors_1.NoResourceError("No user found with those credentials", 404);
            user.destroy();
            res.status(202);
            res.json({ user: null });
        }
        else {
            throw new Error("You can not delete the Demo User account.");
        }
    }
    catch (error) {
        next(error);
    }
}));
router.get("/profile", auth_1.validateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const user = yield User.findByPk(req.user.id, {
            attributes: ["id", "username", "email", "firstName", "lastName"],
        });
        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }
        return res.json({ user });
    }
    catch (error) {
        next(error);
    }
}));
router.put("/profile", auth_1.validateUser, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        const { email, username, password } = req.body;
        const user = yield User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (username && username !== user.username) {
            const existingUsername = yield User.findOne({ where: { username } });
            if (existingUsername) {
                return res.status(400).json({ message: "Username already taken" });
            }
            user.username = username;
        }
        if (email && email !== user.email) {
            const existingEmail = yield User.findOne({ where: { email } });
            if (existingEmail) {
                return res.status(400).json({ message: "Email already taken" });
            }
            user.email = email;
        }
        if (password) {
            (user.hashedPassword = bcrypt.hashSync(password));
        }
        yield user.save();
        const safeUser = yield user.getSafeUser();
        return res.json({ user: safeUser });
    }
    catch (error) {
        next(error);
    }
}));
module.exports = router;
//# sourceMappingURL=users.js.map