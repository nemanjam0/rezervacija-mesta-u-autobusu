'use strict';
import sequelize from 'sequelize'
const Model = sequelize.Model;
const DataTypes = sequelize.DataTypes;
const Rezervacija = {
  init: (db) => db.define('Rezervacija', {
    polazak_id: DataTypes.INTEGER,
    korisnik_id: DataTypes.INTEGER,
    pocetna_destinacija_id: DataTypes.INTEGER,
    krajnja_destinacija_id: DataTypes.INTEGER,
    platio: DataTypes.BOOLEAN,

  }, {
    sequelize,
    modelName: 'Rezervacija',
    tableName: 'rezervacije',
    createdAt: 'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  }),
  associate: (db) => {
    db.models.Rezervacija.belongsTo(db.models.Destinacija, {
      foreignKey: 'pocetna_destinacija_id',
      as: 'pocetna_destinacija'
    });
    db.models.Rezervacija.belongsTo(db.models.Destinacija, {
      foreignKey: 'krajnja_destinacija_id',
      as: 'krajnja_destinacija'
    });
    db.models.Rezervacija.belongsTo(db.models.Korisnik, {
      foreignKey: 'korisnik_id',
      as: 'korisnik'
    });
    db.models.Rezervacija.belongsTo(db.models.Polazak, {
      foreignKey: 'polazak_id',
      as: 'polazak'
    });
    db.models.Rezervacija.hasMany(db.models.RezervisanoSediste, {
      foreignKey: 'rezervacija_id',
      as: 'rezervisana_sedista'
    });
    db.models.Rezervacija.hasOne(db.models.Povratak, {
      foreignKey: 'prva_rezervacija_id',
      as: 'prva_rezervacija'
    });
    db.models.Rezervacija.hasOne(db.models.Povratak, {
      foreignKey: 'povratak_id',
      as: 'povartak'
    });
  }
}

export default Rezervacija;