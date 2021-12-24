'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Povratak extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Rezervacija,{
        foreignKey:'prva_rezervacija_id',
        as:'pocetna_rezervacija'
      });
      this.belongsTo(models.Rezervacija,{
        foreignKey:'povratak_id',
        as:'povratna_rezervacija'
      });
    }
  };
  Povratak.init({
    prva_rezervacija_id: DataTypes.INTEGER,
    povratak_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Povratak',
    tableName:'povratna_putovanja',
    createdAt:'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  });
  return Povratak;
};