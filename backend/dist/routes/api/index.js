"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const auth_1 = require("../../utils/auth");
const models_1 = __importDefault(require("../../db/models"));
const users_1 = __importDefault(require("./users"));
const session_1 = __importDefault(require("./session"));
const home_1 = __importDefault(require("./home"));
const category_1 = __importDefault(require("./category"));
const subcategoryItems_1 = __importDefault(require("./subcategoryItems"));
const items_1 = __importDefault(require("./items"));
const review_1 = __importDefault(require("./review"));
const cart_1 = __importDefault(require("./cart"));
const orders_1 = __importDefault(require("./orders"));
const checkout_1 = __importDefault(require("./checkout"));
const csurf_1 = __importDefault(require("csurf"));
const { User, SpotImage, ReviewImage, Review, Spot } = models_1.default;
const router = require("express").Router();
const { environment } = require("../../config");
const isProduction = environment === "production";
router.use(auth_1.restoreUser);
router.use((0, csurf_1.default)({
    cookie: {
        secure: isProduction,
        sameSite: isProduction && "lax",
        httpOnly: true,
    },
}));
router.use("/session", session_1.default);
router.use("/users", users_1.default);
router.use("/home", home_1.default);
router.use("/category", category_1.default);
router.use('/subCategoryItems', subcategoryItems_1.default);
router.use('/', items_1.default);
router.use('/reviews', review_1.default);
router.use('/cart', cart_1.default);
router.use('/order', orders_1.default);
router.use('/checkout', checkout_1.default);
router.get("/restore-user", (req, res) => {
    return res.json(req.user);
});
module.exports = router;
//# sourceMappingURL=index.js.map