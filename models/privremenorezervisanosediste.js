'use strict';
import sequelize from 'sequelize'
const DataTypes = sequelize.DataTypes;

const PrivremenoRezervisanoSediste = {
  init: (db) => db.define('PrivremenoRezervisanoSediste', {
    polazak_id: DataTypes.INTEGER,
    korisnik_id: DataTypes.INTEGER,
    pocetna_destinacija_id: DataTypes.INTEGER,
    krajnja_destinacija_id: DataTypes.INTEGER,
    red: DataTypes.INTEGER,
    mesto_u_redu: DataTypes.INTEGER,
    istek_rezervacije: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'PrivremenoRezervisanoSediste',
    tableName: 'privremeno_rezervisana_sedista',
    createdAt: 'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  }),
  associate: (db) => {
    db.models.PrivremenoRezervisanoSediste.belongsTo(db.models.Destinacija, {
      foreignKey: 'pocetna_destinacija_id',
      as: 'pocetna_destinacija'
    });
    db.models.PrivremenoRezervisanoSediste.belongsTo(db.models.Destinacija, {
      foreignKey: 'krajnja_destinacija_id',
      as: 'krajnja_destinacija'
    });
    db.models.PrivremenoRezervisanoSediste.belongsTo(db.models.Korisnik, {
      foreignKey: 'korisnici',
      as: 'korisnik'
    });
    db.models.PrivremenoRezervisanoSediste.belongsTo(db.models.Polazak, {
      foreignKey: 'polazak_id',
      as: 'polazak'
    });
  }
}

export default PrivremenoRezervisanoSediste;