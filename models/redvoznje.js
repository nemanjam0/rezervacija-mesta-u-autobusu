'use strict';
import sequelize from 'sequelize'

const DataTypes = sequelize.DataTypes;
const RedVoznje = {
  init: (db) => {
    const RedVoznje = db.define('RedVoznje', {
      naziv: DataTypes.STRING,
      prevoznik_id: DataTypes.INTEGER,
      pocetak_vazenja: DataTypes.DATEONLY,
      rok_vazenja: DataTypes.DATEONLY,
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
      tableName: 'redovi_voznje',
      createdAt: 'vreme_kreiranja',
      updatedAt: 'poslednja_izmena',
    })
    RedVoznje.prototype.daniPolaska = function () {
      var dani = '';
      if (this.ponedeljak == 1) { dani += 'ponedeljak,'; }
      if (this.utorak == 1) { dani += 'utorak,'; }
      if (this.sreda == 1) { dani += 'sreda,'; }
      if (this.cetvrtak == 1) { dani += 'četvrtak,'; }
      if (this.petak == 1) { dani += 'petak,'; }
      if (this.subota == 1) { dani += 'subota,'; }
      if (this.nedelja == 1) { dani += 'nedelja,'; }
      return dani.slice(0, -1);

    }
  },
  associate: (db) => {
    db.models.RedVoznje.hasMany(db.models.Stanica, {
      foreignKey: 'red_voznje_id',
      as: 'stanice'
    });
    db.models.RedVoznje.hasMany(db.models.Cenovnik, {
      foreignKey: 'red_voznje_id',
      as: 'cenovnici'
    });
    db.models.RedVoznje.hasMany(db.models.Polazak, {
      foreignKey: 'red_voznje_id',
      as: 'polasci'
    });
    db.models.RedVoznje.belongsTo(db.models.Prevoznik, {
      foreignKey: 'prevoznik_id',
      as: 'prevoznik'
    })
  }
}

export default RedVoznje;
