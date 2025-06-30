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
      "Orders",
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        userId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Users",
            key: "id",
          },
          onDelete: "CASCADE",
        },
        orderNumber: {
          type: Sequelize.STRING(8),
          allowNull: false,
          unique: true,
        },
        subTotal: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        tax: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        shipping: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        orderTotal: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
        },
        stripePaymentIntentId: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        address: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        city: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        state: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        zip: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        status: {
          type: Sequelize.STRING,
          allowNull: false,
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
    options.tableName = "Orders";
    return queryInterface.dropTable("Orders", options);
  },
};
