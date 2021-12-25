'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('rezervisana_sedista', 'sifra_karte', {
          type: Sequelize.DataTypes.INTEGER,
        }, { transaction: t }),
        queryInterface.addColumn('rezervisana_sedista', 'ocitana', {
          type: Sequelize.DataTypes.BOOLEAN,
        }, { transaction: t }),
      ]);
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('rezervisana_sedista', 'sifra_karte', { transaction: t }),
        queryInterface.removeColumn('rezervisana_sedista', 'ocitana', { transaction: t }),
      ]);
    });
  }
};