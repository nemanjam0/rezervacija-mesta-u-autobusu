'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('cenovnici', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ruta_id: {
        type: Sequelize.INTEGER
      },
      pocetna_destinacija_id: {
        type: Sequelize.INTEGER
      },
      krajnja_destinacija_id: {
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
    await queryInterface.dropTable('cenovnici');
  }
};