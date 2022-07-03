'use strict';
import sequelize from 'sequelize'

const DataTypes = sequelize.DataTypes;

const Destinacija = {
  init: (db) => db.define('Destinacija', {
    ime: DataTypes.STRING,
    cena_peronske: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Destinacija',
    tableName: 'destinacije',
    createdAt: 'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  }),

  associate: (db) => {

  }
}
export default Destinacija;



