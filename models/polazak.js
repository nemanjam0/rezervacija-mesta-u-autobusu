'use strict';
import sequelize from 'sequelize'
import db from './index.js'
const Model = sequelize.Model
const DataTypes = sequelize.DataTypes;

const RedVoznje = {
  init: (db) => db.define('Polazak', {
    vreme_polaska: DataTypes.DATE,
    red_voznje_id: DataTypes.INTEGER,
    autobus_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Polazak',
    tableName: 'polasci',
    createdAt: 'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  }),
  associate: (db) => {
    db.models.Polazak.belongsTo(db.models.Autobus, {
      foreignKey: 'autobus_id',
      as: 'autobus'
    });
    db.models.Polazak.belongsTo(db.models.RedVoznje, {
      foreignKey: 'red_voznje_id',
      as: 'red_voznje'
    });
  }
}

export default RedVoznje;