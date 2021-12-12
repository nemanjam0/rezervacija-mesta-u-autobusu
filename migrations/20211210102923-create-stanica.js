'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stanice', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ruta_id: {
        type: Sequelize.INTEGER
      },
      destinacija_id: {
        type: Sequelize.INTEGER
      },
      redni_broj: {
        type: Sequelize.INTEGER
      },
      broj_minuta_od_pocetka: {
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
    await queryInterface.dropTable('stanice');
  }
};