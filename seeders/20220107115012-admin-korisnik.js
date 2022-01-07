'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('korisnici', [{
      ime:'Admin',
      prezime:'Admin',
      broj_telefona:'069123456',
      email:'admin@admin.com',
      sifra:'$2b$15$Xlc77rk2n7AdVVQFFGgLa.oVIYxpJj/8W1UFH3ghzYiiMiu7fVije',//mojBus123
      tip_naloga:'admin',
      vreme_kreiranja: new Date(),
      poslednja_izmena: new Date()
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('korisnici', null, {});
  }
};
