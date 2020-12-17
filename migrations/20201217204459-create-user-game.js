'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('UserGames', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      GameId: {
        type: Sequelize.INTEGER, references: {model:'Games', field:"id"}
      },
      UserId: {
        type: Sequelize.INTEGER, references: {model: "Users", field:"id"}
      },
      gameplayRating: {
        type: Sequelize.FLOAT
      },
      f2pRating: {
        type: Sequelize.FLOAT
      },
      playing: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('UserGames');
  }
};