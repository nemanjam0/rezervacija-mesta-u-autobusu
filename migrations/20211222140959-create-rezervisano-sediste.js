'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('rezervisana_sedista', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      rezervacija_id: {
        type: Sequelize.INTEGER
      },
      red: {
        type: Sequelize.INTEGER
      },
      mesto_u_redu: {
        type: Sequelize.INTEGER
      },
      cena_karte: {
        type: Sequelize.FLOAT
      },
      vreme_kreiranja: {
        allowNull: false,
        type: Sequelize.DATE
      },
      poslednja_izmena: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('rezervisana_sedista');
  }
};