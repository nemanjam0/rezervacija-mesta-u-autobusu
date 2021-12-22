'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Polazak extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Autobus,{
        foreignKey:'autobus_id',
        as:'autobus'
      });
    }
  };
  Polazak.init({
    vreme_polaska:DataTypes.DATE,
    red_voznje_id: DataTypes.INTEGER,
    autobus_id:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Polazak',
    tableName:'polasci',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return Polazak;
};