"use strict";

import { OptionsInterface } from "../../typings/seeders";

let options:OptionsInterface = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;
}

module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    return queryInterface.createTable("Items", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(250),
        allowNull: true
      },
      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      mainImageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      image2Url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image3Url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image4Url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      image5Url: {
        type: Sequelize.STRING,
        allowNull: true
      },
      categoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Categories",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      subCategoryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "SubCategories",
          key: "id"
        },
        onDelete: "CASCADE"
      },
        // listId: {
        // type: Sequelize.INTEGER,
        // allowNull: true,
        // references: {
        //   model: "Lists",
        //   key: "id"
        // },
        // onDelete: "CASCADE"
      // },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    }, options);
  },
  down: async (queryInterface:any, Sequelize:any) => {
    options.tableName = "Items";
    return queryInterface.dropTable("Items", options);
  }
};
