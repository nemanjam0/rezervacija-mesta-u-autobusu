'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PrivremenoRezervisanoSediste extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Destinacija,{
        foreignKey:'pocetna_destinacija_id',
        as:'pocetna_destinacija'
      });
      this.belongsTo(models.Destinacija,{
        foreignKey:'krajnja_destinacija_id',
        as:'krajnja_destinacija'
      });
      this.belongsTo(models.Korisnik,{
        foreignKey:'korisnici',
        as:'korisnik'
      });
      this.belongsTo(models.Polazak,{
        foreignKey:'polazak_id',
        as:'polazak'
      });
    }
  };
  PrivremenoRezervisanoSediste.init({
    polazak_id: DataTypes.INTEGER,
    korisnik_id: DataTypes.INTEGER,
    pocetna_destinacija_id: DataTypes.INTEGER,
    krajnja_destinacija_id: DataTypes.INTEGER,
    red: DataTypes.INTEGER,
    mesto_u_redu: DataTypes.INTEGER,
    istek_rezervacije: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PrivremenoRezervisanoSediste',
    tableName:'privremeno_rezervisana_sedista',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return PrivremenoRezervisanoSediste;
};