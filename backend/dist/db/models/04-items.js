"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Item extends sequelize_1.Model {
        static associate(models) {
            Item.belongsTo(models.Category, {
                foreignKey: "categoryId",
                as: "category",
            });
            Item.belongsTo(models.SubCategory, {
                foreignKey: "subCategoryId",
                as: "subCategory",
            });
            Item.hasMany(models.Review, { foreignKey: "itemId", as: "reviews" });
        }
    }
    Item.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
            },
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        stars: {
            type: DataTypes.DECIMAL(2, 1),
            allowNull: false,
            validate: {
                min: 0,
                max: 5,
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 250],
            },
        },
        mainImageUrl: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true,
            },
        },
        image2Url: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        image3Url: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        image4Url: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        image5Url: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true
            }
        },
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Categories",
                key: "id",
            },
        },
        subCategoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Subcategories",
                key: "id",
            },
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    }, {
        sequelize,
        modelName: "Item",
        timestamps: true,
    });
    return Item;
};
//# sourceMappingURL=04-items.js.map