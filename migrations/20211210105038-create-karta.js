'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('karte', {
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
      cena_karte: {
        type: Sequelize.FLOAT
      },
      povratna: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      platio: {
        allowNull: false,
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('karte');
  }
};