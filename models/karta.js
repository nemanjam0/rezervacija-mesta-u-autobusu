'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Karta extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Karta.init({
    polazak_id: DataTypes.INTEGER,
    korisnik_id: DataTypes.INTEGER,
    cena_karte: DataTypes.FLOAT,
    povratna:DataTypes.BOOLEAN,
    platio:DataTypes.BOOLEAN,

  }, {
    sequelize,
    modelName: 'Karte',
    tableName:'karte',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return Karta;
};