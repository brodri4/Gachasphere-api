"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailListGame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.DetailListGame.belongsTo(models.Game, {
        as: "game",
        foreignKey: "GameId",
      });
    }
  }
  DetailListGame.init(
    {
      GameId: DataTypes.INTEGER,
      ListId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DetailListGame",
    }
  );
  return DetailListGame;
};
