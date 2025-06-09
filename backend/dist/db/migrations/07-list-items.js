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
        return queryInterface.createTable("ListItems", {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            listId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Lists",
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
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
            },
        }, options);
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        options.tableName = "ListItems";
        return queryInterface.dropTable(options);
    }),
};
//# sourceMappingURL=07-list-items.js.map