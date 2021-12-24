'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RezervisanoSediste extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Rezervacija,{
        foreignKey:'rezervacija_id',
        as:'rezervacija'
      });
    }
  };
  RezervisanoSediste.init({
    rezervacija_id: DataTypes.INTEGER,
    red: DataTypes.INTEGER,
    mesto_u_redu: DataTypes.INTEGER,
    cena_karte: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'RezervisanoSediste',
    tableName:'rezervisana_sedista',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return RezervisanoSediste;
};