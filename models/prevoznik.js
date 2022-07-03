'use strict';
import sequelize from 'sequelize'
const DataTypes = sequelize.DataTypes;
const Prevoznik = {
  init: (db) => db.define('Prevoznik', {
    naziv: DataTypes.STRING,
    logo_url: DataTypes.STRING,
    opis: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Prevoznik',
    tableName: 'prevoznici',
    createdAt: 'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  }),
  associate: () => {

  }
}

export default Prevoznik;