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
      // define association here
    }
  };
  RedVoznje.init({
    naziv:
    {
      type:DataTypes.STRING,
      validate:
      {
        len:{
          args:[3,40],
          msg:"Ime mora imati između 3 i 40 karaktera",
        }
      
      }
    },
    prevoznik_id: DataTypes.INTEGER,
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