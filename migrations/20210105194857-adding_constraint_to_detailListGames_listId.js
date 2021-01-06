"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("DetailListGames", {
      fields: ["ListId"],
      type: "FOREIGN KEY",
      name: "adding-fk-to-listId",
      references: {
        table: "DetailLists",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      "DetailListGames",
      "adding-fk-to-listId"
    );
  },
};
