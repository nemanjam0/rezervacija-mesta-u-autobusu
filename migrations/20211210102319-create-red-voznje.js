'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('redovi_voznje', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      naziv: {
        type: Sequelize.STRING
      },
      rok_vazenja: {
        type: Sequelize.DATEONLY
      },
      prevoznik_id: {
        type: Sequelize.INTEGER
      },
      vreme_polaska: {
        type: Sequelize.TIME
      },
      ponedeljak: {
        type: Sequelize.BOOLEAN
      },
      utorak: {
        type: Sequelize.BOOLEAN
      },
      sreda: {
        type: Sequelize.BOOLEAN
      },
      cetvrtak: {
        type: Sequelize.BOOLEAN
      },
      petak: {
        type: Sequelize.BOOLEAN
      },
      subota: {
        type: Sequelize.BOOLEAN
      },
      nedelja: {
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
    await queryInterface.dropTable('redovi_voznje');
  }
};