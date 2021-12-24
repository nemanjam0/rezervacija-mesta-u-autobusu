'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('privremeno_rezervisana_sedista', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      polazak_id: {
        type: Sequelize.INTEGER
      },
      korisnik_id: {
        type: Sequelize.INTEGER
      },
      pocetna_destinacija_id: {
        type: Sequelize.INTEGER
      },
      krajnja_destinacija_id: {
        type: Sequelize.INTEGER
      },
      istek_rezervacije: {
        allowNull: false,
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
    await queryInterface.dropTable('privremeno_rezervisana_sedista');
  }
};