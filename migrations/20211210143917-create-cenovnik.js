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
      red_voznje_id: {
        type: Sequelize.INTEGER
      },
      pocetna_destinacija_id: {
        type: Sequelize.INTEGER
      },
      krajnja_destinacija_id: {
        type: Sequelize.INTEGER
      },
      cena_jedan_smer: {
        type: Sequelize.FLOAT
      },
      cena_povratna: {
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