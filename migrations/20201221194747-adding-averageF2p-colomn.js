"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn("Games", "averageF2P", Sequelize.FLOAT);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn("Games", "averageF2P");
  },
};
