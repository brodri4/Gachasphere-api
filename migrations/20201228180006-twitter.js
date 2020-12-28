'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn( 
    'Games', // table name
    'twitter', // new field name
    {
      type: Sequelize.STRING,
      allowNull: true,
    },
)},

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Games', "twitter");
  }
};