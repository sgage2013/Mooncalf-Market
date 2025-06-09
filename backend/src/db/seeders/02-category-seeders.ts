'use strict';

import { OptionsInterface } from "../../typings/seeders";

let options:OptionsInterface = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}



module.exports = {
  up: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'Categories';
    return queryInterface.bulkInsert(options, [
  {
    name: "Cauldrons and Potions",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Apparel",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Wands",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Broomsticks",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Magical Creatures and Companions",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Books and Scrolls",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Candy and Treats",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
 
], {});
  },

  down: async (queryInterface:any, Sequelize:any) => {
    options.tableName = 'Categories';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: [''] }
    }, {});
  }
};
