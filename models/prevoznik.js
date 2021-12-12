'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Prevoznik extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Prevoznik.init({
    naziv: DataTypes.STRING,
    logo_url: DataTypes.STRING,
    opis: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Prevoznik',
    tableName:'prevoznici',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return Prevoznik;
};