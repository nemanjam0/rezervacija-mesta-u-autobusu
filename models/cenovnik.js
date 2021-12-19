'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cenovnik extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.RedVoznje,{
        foreignKey:'red_voznje_id',
        as:'red_voznje'
      });
      this.belongsTo(models.Destinacija,{
        foreignKey:'pocetna_destinacija_id',
        as:'pocetna_destinacija'
      });
      this.belongsTo(models.Destinacija,{
        foreignKey:'krajnja_destinacija_id',
        as:'krajnja_destinacija'
      });
    }
  };
  Cenovnik.init({
    red_voznje_id: DataTypes.INTEGER,
    pocetna_destinacija_id: DataTypes.INTEGER,
    krajnja_destinacija_id: DataTypes.INTEGER,
    cena_jedan_smer: 
    {
      type:DataTypes.FLOAT,
      validate:
      {
        isFloat:
        {
          args:true,
          msg:"Cene karata mogu biti samo celi ili decimalni brojevi"
        }
      }
    },
    cena_povratna: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Cenovnik',
    tableName:'cenovnici',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return Cenovnik;
};