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
const { Category, SubCategory, Item, Review } = models_1.default;
router.get("/category/:categoryId/:subCategoryId/items/:itemId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId, subCategoryId, itemId } = req.params;
        console.log(`backend: fetchinf item with categoryId: ${categoryId}, subcategoryid: ${subCategoryId}, itemid:, ${itemId}`);
        const item = yield Item.findOne({
            where: {
                id: itemId,
                subCategoryId,
            },
            include: [
                {
                    model: SubCategory,
                    as: "subCategory",
                    where: { categoryId },
                    include: [
                        {
                            model: Category,
                            as: "category",
                        },
                    ],
                },
            ],
        });
        console.log('backend: item found', !!item);
        if (!item) {
            return res.status(404).json({ message: "Item not Found" });
        }
        const reviews = yield Review.findAll({
            where: { itemId: item.id },
            attributes: ["id", "stars", "reviewBody", "userId", "createdAt"],
            order: [['createdAt', 'DESC']],
            limit: 3,
        });
        const avgRating = reviews.length > 0
            ? (reviews.reduce((sum, review) => sum + review.stars, 0) /
                reviews.length)
            : null;
        return res.json({
            id: item.id,
            name: item.name,
            mainImageUrl: item.mainImageUrl,
            image2Url: item.image2Url,
            image3Url: item.image3Url,
            image4Url: item.image4Url,
            image5Url: item.image5Url,
            price: item.price,
            description: item.description,
            stars: avgRating,
            category: item.subCategory.category.name,
            subCategory: item.subCategory.name,
            reviews
        });
    }
    catch (error) {
        console.error("Backend: Error in single item route:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get('/category/:categoryId/items', auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paramCategoryId = parseInt(req.params.categoryId, 10);
    try {
        const items = yield Item.findAll({
            include: [
                { model: SubCategory,
                    as: 'subCategory',
                    where: { categoryId: paramCategoryId },
                    attributes: ['id'],
                    required: true
                }
            ],
            attributes: ['id', 'name', 'price', 'mainImageUrl', 'subCategoryId'],
            order: [['createdAt', 'DESC']]
        });
        if (!items.length) {
            return res.json({ items });
        }
        return res.json({ items });
    }
    catch (error) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}));
module.exports = router;
//# sourceMappingURL=items.js.map