'use strict';
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
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;
}
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        options.tableName = 'Categories';
        return queryInterface.bulkInsert(options, [
            {
                name: "Cauldrons and Potions",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Apparel",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Wands",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Broomsticks",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Magical Creatures and Companions",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Books and Scrolls",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
            {
                name: "Candy and Treats",
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        ], {});
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        options.tableName = 'Categories';
        const Op = Sequelize.Op;
        return queryInterface.bulkDelete(options, {
            username: { [Op.in]: [''] }
        }, {});
    })
};
//# sourceMappingURL=02-category-seeders.js.map