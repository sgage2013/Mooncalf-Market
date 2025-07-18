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
if (process.env.NODE_ENV === 'production') {
    options.schema = process.env.SCHEMA;
}
module.exports = {
    up: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        return queryInterface.createTable("Items", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            name: {
                type: Sequelize.STRING(50),
                allowNull: false
            },
            description: {
                type: Sequelize.STRING(250),
                allowNull: true
            },
            price: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false
            },
            stars: {
                type: Sequelize.DECIMAL(2, 1),
                allowNull: false,
            },
            mainImageUrl: {
                type: Sequelize.STRING,
                allowNull: false
            },
            image2Url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            image3Url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            image4Url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            image5Url: {
                type: Sequelize.STRING,
                allowNull: true
            },
            categoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Categories",
                    key: "id"
                },
                onDelete: "CASCADE"
            },
            subCategoryId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "SubCategories",
                    key: "id"
                },
                onDelete: "CASCADE"
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        }, options);
    }),
    down: (queryInterface, Sequelize) => __awaiter(void 0, void 0, void 0, function* () {
        options.tableName = "Items";
        return queryInterface.dropTable("Items", options);
    })
};
//# sourceMappingURL=04-items.js.map