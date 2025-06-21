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
      "CartItems",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
       cartId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Carts",
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
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          onDelete: "CASCADE",
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
    options.tableName = "CartItems";
    return queryInterface.dropTable("CartItems", options);
  },
};