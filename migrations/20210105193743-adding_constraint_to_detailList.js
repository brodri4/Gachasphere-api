"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addConstraint("DetailLists", {
      fields: ["UserId"],
      type: "FOREIGN KEY",
      name: "adding-fk-to-detaillist",
      references: {
        table: "Users",
        field: "id",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(
      "DetailLists",
      "adding-fk-to-detaillist"
    );
  },
};
