'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('polasci', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      red_voznje_id: {
        type: Sequelize.INTEGER
      },
      autobus_id: {
        type: Sequelize.INTEGER
      },
      vreme_polaska: {
        allowNull:false,
        type: Sequelize.DATE
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
    await queryInterface.dropTable('polasci');
  }
};