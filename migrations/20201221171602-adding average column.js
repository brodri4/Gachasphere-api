"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Games", "averageRating", Sequelize.FLOAT);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Games", "averageRating");
  },
};
