'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Destinacija extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Destinacija.init({
    ime: DataTypes.STRING,
    cena_peronske: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Destinacija',
    tableName:'destinacije',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return Destinacija;
};