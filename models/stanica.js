'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stanica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Stanica.init({
    red_voznje_id: DataTypes.INTEGER,
    destinacija_id: DataTypes.INTEGER,
    redni_broj: DataTypes.INTEGER,
    broj_minuta_od_pocetka: DataTypes.INTEGER,
    broj_km_od_pocetka: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Stanica',
    tableName:'stanice',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return Stanica;
};