'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
    return Promise.all([
      queryInterface.addColumn('Games', 'iOS', {
        type: Sequelize.DataTypes.STRING, allowNull: true
      }, { transaction: t }),
      queryInterface.addColumn('Games', 'Android', {
        type: Sequelize.DataTypes.STRING, allowNull: true
      }, { transaction: t })
    ]);
  })
},

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('Games', 'iOS', { transaction: t }),
        queryInterface.removeColumn('Games', 'Android', { transaction: t })
      ]);
    });
  }
};
