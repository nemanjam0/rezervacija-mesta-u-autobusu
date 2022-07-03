'use strict';
import sequelize from 'sequelize'
const DataTypes = sequelize.DataTypes;
const Autobus = {
  init: (db) => {
    db.define('Autobus', {
      naziv: DataTypes.STRING,
      broj_redova: DataTypes.INTEGER,
      broj_sedista_levo: DataTypes.INTEGER,
      broj_sedista_desno: DataTypes.INTEGER,
      broj_sedista_u_zadnjem_redu: DataTypes.INTEGER
    }, {
      sequelize,
      modelName: 'Autobus',
      tableName: 'autobusi',
      createdAt: 'vreme_kreiranja',
      updatedAt: 'poslednja_izmena',
    })
  },
  associate: (db) => {

  }
}
export default Autobus;

