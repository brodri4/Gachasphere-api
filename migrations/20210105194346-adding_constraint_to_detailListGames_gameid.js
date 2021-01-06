"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("DetailListGames", {
      fields: ["GameId"],
      type: "FOREIGN KEY",
      name: "adding-fk-to-gameId",
      references: {
        table: "Games",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      "DetailListGames",
      "adding-fk-to-gameId"
    );
  },
};
