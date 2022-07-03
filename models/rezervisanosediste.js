'use strict';
import sequelize from 'sequelize'
const DataTypes = sequelize.DataTypes;
const RezervisanoSediste = {
  init: (db) => db.define('RezervisanoSediste', {
    rezervacija_id: DataTypes.INTEGER,
    red: DataTypes.INTEGER,
    mesto_u_redu: DataTypes.INTEGER,
    cena_karte: DataTypes.FLOAT,
    sifra_karte: DataTypes.INTEGER,
    ocitana: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'RezervisanoSediste',
    tableName: 'rezervisana_sedista',
    createdAt: 'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  }),

  associate: (db) => {
    db.models.RezervisanoSediste.belongsTo(db.models.Rezervacija, {
      foreignKey: 'rezervacija_id',
      as: 'rezervacija'
    });
  }
}

export default RezervisanoSediste;