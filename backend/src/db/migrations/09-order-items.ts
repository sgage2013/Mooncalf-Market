"use strict";

import { on } from "events";
import { OptionsInterface } from "../../typings/seeders";

let options: OptionsInterface = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return queryInterface.createTable(
      "OrderItems",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        orderId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Orders",
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
          price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            validate: {
              min: 0.01,
            },
          },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  down: async (queryInterface: any, Sequelize: any) => {
    options.tableName = "OrderItems";
    return queryInterface.dropTable("OrderItems", options);
  },
};