'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rezervacija extends Model {
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
        foreignKey:'korisnik_id',
        as:'korisnik'
      });
      this.belongsTo(models.Polazak,{
        foreignKey:'polazak_id',
        as:'polazak'
      });
      this.hasMany(models.RezervisanoSediste,{
        foreignKey:'rezervacija_id',
        as:'rezervisana_sedista'
      });
      this.hasOne(models.Povratak,{
        foreignKey:'prva_rezervacija_id',
        as:'prva_rezervacija'
      });
      this.hasOne(models.Povratak,{
        foreignKey:'povratak_id',
        as:'povartak'
      });
    }
  };
  Rezervacija.init({
    polazak_id: DataTypes.INTEGER,
    korisnik_id: DataTypes.INTEGER,
    pocetna_destinacija_id:DataTypes.INTEGER,
    krajnja_destinacija_id:DataTypes.INTEGER,
    platio:DataTypes.BOOLEAN,

  }, {
    sequelize,
    modelName: 'Rezervacija',
    tableName:'rezervacije',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return Rezervacija;
};