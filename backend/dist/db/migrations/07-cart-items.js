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
        return queryInterface.createTable("CartItems", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            cartId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Carts",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            itemId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Items",
                    key: "id",
                },
                onDelete: "CASCADE",
            },
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                onDelete: "CASCADE",
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        }, options);
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        options.tableName = "CartItems";
        return queryInterface.dropTable("CartItems", options);
    }),
};
//# sourceMappingURL=07-cart-items.js.map