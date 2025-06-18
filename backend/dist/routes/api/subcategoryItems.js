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
const { SubCategory, Item, Review } = models_1.default;
router.get("/category/:categoryId/:subCategoryId/items", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, subCategoryId } = req.params;
    try {
        const subCategory = yield SubCategory.findOne({
            where: {
                id: subCategoryId,
                categoryId: categoryId,
            },
        });
        if (!subCategory) {
            return res.status(404).json({ message: "Subcategory not found" });
        }
        const items = yield Item.findAll({
            where: { subCategoryId },
            include: [
                {
                    model: Review,
                    as: "reviews",
                    attributes: [],
                    required: false,
                },
            ],
            attributes: {
                include: [
                    [
                        models_1.default.sequelize.fn("AVG", models_1.default.sequelize.col("reviews.stars")),
                        "avgRating",
                    ],
                    [
                        models_1.default.sequelize.fn("COUNT", models_1.default.sequelize.col("reviews.id")),
                        "reviewCount",
                    ],
                ],
            },
            group: ["Item.id"],
        });
        return res.json({ items });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to fetch items" });
    }
}));
module.exports = router;
//# sourceMappingURL=subcategoryItems.js.map