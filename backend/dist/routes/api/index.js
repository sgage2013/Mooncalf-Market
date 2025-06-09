"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const auth_1 = require("../../utils/auth");
const models_1 = __importDefault(require("../../db/models"));
const users_1 = __importDefault(require("./users"));
const session_1 = __importDefault(require("./session"));
const csurf_1 = __importDefault(require("csurf"));
const { User, SpotImage, ReviewImage, Review, Spot } = models_1.default;
const router = require('express').Router();
const { environment } = require('../../config');
const isProduction = environment === 'production';
router.use(auth_1.restoreUser);
router.use((0, csurf_1.default)({
    cookie: {
        secure: isProduction,
        sameSite: isProduction && "lax",
        httpOnly: true
    }
}));
router.use('/session', session_1.default);
router.use('/users', users_1.default);
router.get('/restore-user', (req, res) => {
    return res.json(req.user);
});
module.exports = router;
//# sourceMappingURL=index.js.map