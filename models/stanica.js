'use strict';
import sequelize from 'sequelize'
import db from './index.js'

const DataTypes = sequelize.DataTypes;
const Stanica = {
  init: (db) => db.define('Stanica', {
    red_voznje_id: DataTypes.INTEGER,
    destinacija_id: DataTypes.INTEGER,
    redni_broj: DataTypes.INTEGER,
    broj_minuta_od_pocetka: DataTypes.INTEGER,
    broj_km_od_pocetka: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Stanica',
    tableName: 'stanice',
    createdAt: 'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  }),
  associate: (db) => {
    db.models.Stanica.hasMany(db.models.Cenovnik, {
      foreignKey: 'pocetna_destinacija_id',
      as: 'cenovnici_od_pocetne'
    });
    db.models.Stanica.hasMany(db.models.Cenovnik, {
      foreignKey: 'krajnja_destinacija_id',
      as: 'cenovnici_do_krajnje'
    });
    db.models.Stanica.belongsTo(db.models.RedVoznje, {
      foreignKey: 'red_voznje_id',
      as: 'red_voznje'
    });
    db.models.Stanica.belongsTo(db.models.Destinacija, {
      foreignKey: 'destinacija_id',
      as: 'destinacija'
    });
  }
}
export default Stanica;
