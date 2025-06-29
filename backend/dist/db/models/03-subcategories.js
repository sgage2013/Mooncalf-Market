"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class SubCategory extends sequelize_1.Model {
        static associate(models) {
            SubCategory.belongsTo(models.Category, {
                foreignKey: 'categoryId',
                as: 'category',
            });
            SubCategory.hasMany(models.Item, {
                foreignKey: 'subCategoryId',
                as: 'items',
            });
        }
    }
    SubCategory.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [2, 50],
            },
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Categories',
                key: 'id',
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: 'SubCategory',
        timestamps: true,
    });
    return SubCategory;
};
//# sourceMappingURL=03-subcategories.js.map