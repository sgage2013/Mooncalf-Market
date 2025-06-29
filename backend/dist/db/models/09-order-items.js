"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class OrderItem extends sequelize_1.Model {
        static associate(models) {
            OrderItem.belongsTo(models.Order, { foreignKey: "orderId", as: "order" });
            OrderItem.belongsTo(models.Item, { foreignKey: "itemId", as: "item" });
        }
    }
    OrderItem.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Orders",
                key: "id",
            },
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Items",
                key: "id",
            },
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
            validate: {
                min: 1,
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
        modelName: "OrderItem",
        timestamps: true,
    });
    return OrderItem;
};
//# sourceMappingURL=09-order-items.js.map