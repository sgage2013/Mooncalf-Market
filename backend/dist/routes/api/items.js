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
const { Category, SubCategory, Item, Review, User } = models_1.default;
function validateReview(body) {
    if (typeof body.reviewBody !== "string" ||
        body.reviewBody.length < 25 ||
        body.reviewBody.length > 250) {
        return "Review must be between 25 and 250 characters";
    }
    if (typeof body.stars !== "number" || body.stars < 1 || body.stars > 5) {
        return "Stars must be between 1 and 5";
    }
    return null;
}
router.get("/category/:categoryId/:subCategoryId/items/:itemId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId, subCategoryId, itemId } = req.params;
        const item = yield Item.findOne({
            where: {
                id: itemId,
                subCategoryId,
            },
            include: [
                {
                    model: SubCategory,
                    as: "subcategory",
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
        if (!item) {
            return res.status(404).json({ message: "Item not Found" });
        }
        const reviews = yield Review.findAll({
            where: { itemId: item.id },
            attributes: ["id", "stars", "reviewBody", "userId", "createdAt"],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['username'],
                }
            ],
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
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.get('/category/:categoryId/items', auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const paramCategoryId = parseInt(req.params.categoryId, 10);
    try {
        const items = yield Item.findAll({
            include: [
                { model: SubCategory,
                    as: 'subcategory',
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
router.get("/items/:itemId", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const itemId = parseInt(req.params.itemId, 10);
    try {
        const item = yield Item.findByPk(itemId, {
            include: [
                {
                    model: SubCategory,
                    as: "subcategory",
                    include: [
                        {
                            model: Category,
                            as: "category",
                        },
                    ],
                },
            ],
        });
        if (!item) {
            return res.status(404).json({ message: "Item not Found" });
        }
        const reviews = yield Review.findAll({
            where: { itemId: item.id },
            attributes: ["id", "stars", "reviewBody", "userId", "createdAt"],
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["username"],
                },
            ],
            order: [["createdAt", "DESC"]],
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
            reviews,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}));
router.post("/items/:itemId/reviews", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const { reviewBody, stars } = req.body;
        const userId = req.user.id;
        const validationError = validateReview({ reviewBody, stars });
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const existingReview = yield Review.findOne({
            where: { userId: req.user.id, itemId },
        });
        if (existingReview) {
            return res.status(400).json({
                message: "You cannot leave more than one review for an item.",
            });
        }
        const newReview = yield Review.create({
            userId: req.user.id,
            itemId,
            reviewBody,
            stars,
        });
        const createdReview = yield Review.findByPk(newReview.id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["username", "id"],
                },
            ],
            attributes: ["id", "stars", "reviewBody", "createdAt", "itemId", "userId"],
        });
        return res.json({ createdReview });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to create review" });
    }
}));
router.get("/items/:itemId/reviews", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const reviews = yield Review.findAll({
            where: { itemId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["username", "id"],
                },
            ],
            attributes: ["id", "stars", "reviewBody", "createdAt", "itemId", "userId"],
            order: [["createdAt", "DESC"]],
        });
        return res.status(200).json(reviews);
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to load reviews" });
    }
}));
module.exports = router;
//# sourceMappingURL=items.js.map