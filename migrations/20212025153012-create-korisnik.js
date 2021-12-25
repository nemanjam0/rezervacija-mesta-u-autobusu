'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('korisnici', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ime: {
        type: Sequelize.STRING
      },
      prezime: {
        type: Sequelize.STRING
      },
      broj_telefona: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      sifra: {
        type: Sequelize.STRING
      },
      tip_naloga: {
        type: Sequelize.ENUM,
        values:['korisnik','kondukter','vozac','prodavac','admin'],
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
    await queryInterface.dropTable('korisnici');
  }
};