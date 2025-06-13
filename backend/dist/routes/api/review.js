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
const { User, Review } = models_1.default;
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
router.get("/items/:itemId/reviews", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const reviews = yield Review.findAll({
            where: { itemId },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["username"],
                },
            ],
            attributes: ["id", "stars", "reviewBody", "createdAt"],
            order: [["createdAt", "DESC"]],
        });
        return res.status(200).json({ reviews });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to load reviews" });
    }
}));
router.post("/items/:itemId/reviews", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { itemId } = req.params;
        const { reviewBody, stars } = req.body;
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
        return res.json({ newReview });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to create review" });
    }
}));
router.put("/items/:itemId/reviews/:reviewId", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewId } = req.params;
        const { reviewBody, stars } = req.body;
        const validationError = validateReview({ reviewBody, stars });
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const review = yield Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        review.reviewBody = reviewBody;
        review.stars = stars;
        yield review.save();
        return res.json({ review });
    }
    catch (_a) {
        return res.status(500).json({ message: "Failed to update review" });
    }
}));
router.delete("/items/:itemId/reviews/:reviewId", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewId } = req.params;
        const review = yield Review.findByPk(reviewId);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }
        if (review.userId !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        yield review.destroy();
        return res.status(200).json({ message: "Review deleted successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to delete review" });
    }
}));
module.exports = router;
//# sourceMappingURL=review.js.map