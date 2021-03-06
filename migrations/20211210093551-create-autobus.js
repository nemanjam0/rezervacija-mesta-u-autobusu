'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('autobusi', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      naziv: {
        type: Sequelize.STRING
      },
      broj_redova: {
        type: Sequelize.INTEGER
      },
      broj_sedista_levo: {
        type: Sequelize.INTEGER
      },
      broj_sedista_desno: {
        type: Sequelize.INTEGER
      },
      broj_sedista_u_zadnjem_redu: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('autobusi');
  }
};