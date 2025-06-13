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
const express_validator_1 = require("express-validator");
const auth_1 = require("../../utils/auth");
const validation_1 = require("../../utils/validation");
const models_1 = __importDefault(require("../../db/models"));
const router = require("express").Router();
const { Item, Review, List } = models_1.default;
const validList = [
    (0, express_validator_1.check)("name").notEmpty().withMessage("List name is required"),
    (0, express_validator_1.check)("description")
        .optional()
        .isLength({ max: 250 })
        .withMessage("Description must be less than 250 characters"),
    validation_1.handleValidationErrors,
];
router.get("/lists", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lists = yield List.findAll({
            where: { userId: req.user.id },
        });
        return res.json({ lists });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to load lists" });
    }
}));
router.get("/lists/:listId", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const listId = req.params.listId;
        const list = yield List.findOne({
            where: {
                id: listId,
                userId: req.user.id,
            },
            include: [
                {
                    model: Item,
                    through: { attributes: [] },
                    attributes: [
                        "id",
                        "name",
                        "price",
                        [
                            models_1.default.sequelize.fn("AVG", models_1.default.sequelize.col("items.reviews.rating")),
                            "avgRating",
                        ],
                    ],
                    include: [
                        {
                            model: Review,
                            attributes: [],
                        },
                    ],
                },
            ],
            group: ["List.id", "items.id"],
        });
        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }
        return res.json(list);
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to load list" });
    }
}));
router.post("/lists", auth_1.validateUser, validList, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description } = req.body;
        const list = yield List.create({
            name,
            description,
            userId: req.user.id,
        });
        return res.json(list);
    }
    catch (error) {
        return res.status(500).json({ message: "Could not create list" });
    }
}));
router.put("/lists/:listId", validList, auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listId } = req.params;
        const { name, description } = req.body;
        const list = yield List.findOne({
            where: { id: listId, userId: req.user.id }
        });
        list.name = name;
        list.description = description;
        yield list.save();
        return res.json(list);
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to update list" });
    }
}));
router.delete("/lists/:listId", auth_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { listId } = req.params;
        const list = yield List.findOne({
            where: { id: listId, userId: req.user.id },
        });
        if (!list) {
            return res.status(404).json({ message: "List not found" });
        }
        yield list.destroy();
        return res.status(200).json({ message: 'List deleted successfully' });
    }
    catch (error) {
        return res.status(500).json({ message: "Unable to delete list" });
    }
}));
module.exports = router;
//# sourceMappingURL=list.js.map