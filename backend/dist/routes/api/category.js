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
const { SubCategory, Category, Item } = models_1.default;
router.get("/category/:categoryId", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId } = req.params;
    try {
        const category = yield Category.findByPk(categoryId, {
            attributes: ["id", "name"],
            include: [
                {
                    model: SubCategory,
                    as: "subcategories",
                    attributes: ["id", "name"],
                },
            ],
        });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }
        const newArrivals = yield Item.findAll({
            where: { categoryId },
            order: [["createdAt", "DESC"]],
            limit: 10,
        });
        return res.json({
            category,
            newArrivals,
        });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to load Categories" });
    }
}));
router.get("/", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield Category.findAll({
            include: [
                {
                    model: SubCategory,
                    as: "subCategories",
                    attributes: ["id", "name", "categoryId"],
                },
            ],
            attributes: ["id", "name"],
        });
        return res.json({ categories });
    }
    catch (error) {
        return res.status(500).json({ message: "Failed to load categories" });
    }
}));
module.exports = router;
//# sourceMappingURL=category.js.map