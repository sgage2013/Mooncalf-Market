"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Review extends sequelize_1.Model {
        static associate(models) {
            Review.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });
            Review.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
        }
    }
    Review.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Items',
                key: 'id',
            },
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id',
            },
        },
        stars: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1,
                max: 5,
            },
        },
        reviewBody: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [25, 250],
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
        modelName: 'Review',
        timestamps: true,
    });
    return Review;
};
//# sourceMappingURL=06-reviews.js.map