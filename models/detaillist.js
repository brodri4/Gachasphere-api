"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.DetailList.hasMany(models.DetailListGame, {
        as: "gamesList",
        foreignKey: "ListId",
      });
    }
  }
  DetailList.init(
    {
      UserId: DataTypes.INTEGER,
      Name: DataTypes.STRING,
      IsActive: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "DetailList",
    }
  );
  return DetailList;
};
