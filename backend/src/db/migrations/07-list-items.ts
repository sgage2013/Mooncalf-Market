"use strict";

import { OptionsInterface } from "../../typings/seeders";

let options: OptionsInterface = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface: any, Sequelize: any) => {
    return queryInterface.createTable(
      "ListItems",
      {
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        listId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Lists",
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
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        },
      },
      options
    );
  },
  down: async (queryInterface: any, Sequelize: any) => {
    options.tableName = "ListItems";
    return queryInterface.dropTable("ListItems", options);
  },
};
