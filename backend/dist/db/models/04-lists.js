"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class List extends sequelize_1.Model {
        static associate(models) {
            List.belongsTo(models.User, { foreignKey: "userId", as: "user" });
            List.hasMany(models.Item, { foreignKey: "listId", as: "items" });
        }
    }
    List.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Users",
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: [1, 50],
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                len: [0, 250],
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
        modelName: "List",
        timestamps: true,
    });
    return List;
};
//# sourceMappingURL=04-lists.js.map