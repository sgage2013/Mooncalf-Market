"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CartItem extends sequelize_1.Model {
        static associate(models) {
            CartItem.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
            CartItem.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });
        }
    }
    CartItem.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        cartId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Carts',
                key: 'id',
            },
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Items',
                key: 'id',
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
        modelName: 'CartItem',
    });
    return CartItem;
};
//# sourceMappingURL=09-cart-items.js.map