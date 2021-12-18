'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RedVoznje extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.Stanica,{
        foreignKey:'red_voznje_id'
      });
      this.hasMany(models.Cenovnik,{
       foreignKey:'red_voznje_id'
     });
      this.hasMany(models.Polazak,{
       foreignKey:'red_voznje_id'
     });
    }
  };
  RedVoznje.init({
    naziv: DataTypes.STRING,
    prevoznik_id: DataTypes.INTEGER,
    pocetak_vazenja:DataTypes.DATEONLY,
    rok_vazenja:DataTypes.DATEONLY,
    vreme_polaska: DataTypes.TIME,
    ponedeljak: DataTypes.BOOLEAN,
    utorak: DataTypes.BOOLEAN,
    sreda: DataTypes.BOOLEAN,
    cetvrtak: DataTypes.BOOLEAN,
    petak: DataTypes.BOOLEAN,
    subota: DataTypes.BOOLEAN,
    nedelja: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'RedVoznje',
    tableName:'redovi_voznje',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return RedVoznje;
};