'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserGame extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.UserGame.belongsTo(models.User)
      models.UserGame.belongsTo(models.Game)
    }
  };
  UserGame.init({
    GameId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    gameplayRating: DataTypes.FLOAT,
    f2pRating: DataTypes.FLOAT,
    playing: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserGame',
  });
  return UserGame;
};