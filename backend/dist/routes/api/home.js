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
const models_1 = __importDefault(require("../../db/models"));
const router = require("express").Router();
const { Item, Review, Category, SubCategory } = models_1.default;
router.get("/", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category.findAll({
            attributes: ['id', 'name'],
            include: [{
                    model: SubCategory,
                    as: 'subcategories',
                    attributes: ['id', 'name'],
                }],
        });
        const newArrivals = yield Item.findAll({
            attributes: [
                'id',
                'name',
                'mainImageUrl',
                'price',
                'categoryId',
                'subcategoryId',
                [models_1.default.sequelize.fn("AVG", models_1.default.sequelize.col("reviews.stars")),
                    "avgRating"],
            ],
            include: [
                {
                    model: Review,
                    as: "reviews",
                    attributes: [],
                    required: false,
                },
            ],
            group: ["Item.id"],
            order: [["createdAt", "DESC"]],
            limit: 10,
            subQuery: false,
        });
        const highestRated = yield Item.findAll({
            attributes: [
                'id',
                'name',
                'mainImageUrl',
                'price',
                'categoryId',
                'subcategoryId',
                [models_1.default.sequelize.fn("AVG", models_1.default.sequelize.col("reviews.stars")),
                    "avgRating"],
            ],
            include: [
                {
                    model: Review,
                    as: "reviews",
                    attributes: [],
                    required: false,
                },
            ],
            group: ["Item.id"],
            order: [[models_1.default.sequelize.literal("avgRating"), "DESC"]],
            limit: 10,
            subQuery: false,
        });
        return res.json({
            categories,
            newArrivals,
            highestRated,
        });
    }
    catch (error) {
        return res.status(500).json("Failed to load home content");
    }
}));
module.exports = router;
//# sourceMappingURL=home.js.map