"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Order extends sequelize_1.Model {
        static associate(models) {
            Order.belongsTo(models.User, { foreignKey: "userId", as: "user" });
            Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items" });
        }
    }
    Order.init({
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
        orderNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        subTotal: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        tax: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        shipping: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        orderTotal: {
            type: DataTypes.DECIMAL,
            allowNull: false,
        },
        stripePaymentIntentId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zip: {
            type: DataTypes.STRING,
            allowNull: false
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [["Pending", "Processing", "Confirmed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"]],
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
        modelName: "Order",
        timestamps: true,
    });
    return Order;
};
//# sourceMappingURL=10-orders.js.map