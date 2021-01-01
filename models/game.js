"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Game.hasMany(models.UserGame, {
        onDelete: "cascade",
        hooks: true,
      });
    }
  }
  Game.init(
    {
      title: DataTypes.STRING,
      releaseDate: DataTypes.STRING,
      developer: DataTypes.STRING,
      logo: DataTypes.STRING,
      reddit: DataTypes.STRING,
      averageRating: DataTypes.FLOAT,
      averageF2P: DataTypes.FLOAT,
      numberOfPlayer: DataTypes.INTEGER,
      twitter: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Game",
    }
  );
  return Game;
};
