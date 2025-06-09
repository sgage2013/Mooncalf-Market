"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ListItem extends sequelize_1.Model {
        static associate(models) {
            ListItem.belongsTo(models.List, { foreignKey: 'listId', as: 'list' });
            ListItem.belongsTo(models.Item, { foreignKey: 'itemId', as: 'item' });
        }
    }
    ListItem.init({
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        listId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Lists',
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
        modelName: 'ListItem',
        timestamps: true,
    });
    return ListItem;
};
//# sourceMappingURL=07-list-items.js.map