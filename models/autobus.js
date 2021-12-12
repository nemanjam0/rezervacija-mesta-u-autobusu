'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Autobus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Autobus.init({
    naziv:DataTypes.STRING,
    broj_redova: DataTypes.INTEGER,
    broj_sedista_levo: DataTypes.INTEGER,
    broj_sedista_desno: DataTypes.INTEGER,
    broj_sedista_u_zadnjem_redu: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Autobus',
    tableName:'autobusi',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return Autobus;
};