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
Object.defineProperty(exports, "__esModule", { value: true });
let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        options.tableName = "SubCategories";
        return queryInterface.bulkInsert(options, [
            {
                name: "Cauldrons",
                categoryId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Cauldron Accessories",
                categoryId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Potion Ingredients",
                categoryId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Bottles and Vials",
                categoryId: 1,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Robes",
                categoryId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Cloaks & Capes",
                categoryId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Hats & Hoods",
                categoryId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Accessories",
                categoryId: 2,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Wand Cores",
                categoryId: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Wand Woods",
                categoryId: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Wand Accessories",
                categoryId: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Finished Wands",
                categoryId: 3,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Training Brooms",
                categoryId: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Racing Brooms",
                categoryId: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Luxury Brooms",
                categoryId: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Broomstick Accessories",
                categoryId: 4,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Owls",
                categoryId: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Cats",
                categoryId: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Toads",
                categoryId: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Creature Care",
                categoryId: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Creature Accessories",
                categoryId: 5,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Spellbooks",
                categoryId: 6,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Scrolls & Tomes",
                categoryId: 6,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Beginner Spellbooks",
                categoryId: 6,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Textbooks",
                categoryId: 6,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Field Guides",
                categoryId: 6,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Sweets",
                categoryId: 7,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Magical Snacks",
                categoryId: 7,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Potions and Tonics",
                categoryId: 7,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        options.tableName = "SubCategories";
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            username: { [Op.in]: [""] },
        }, {});
    }),
};
//# sourceMappingURL=03-subcategory-seeders.js.map