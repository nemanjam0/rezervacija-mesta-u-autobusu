'use strict';
import sequelize from 'sequelize'
const DataTypes = sequelize.DataTypes;
const Povratak = {
  init: (db) => db.define('Povratak', {
    prva_rezervacija_id: DataTypes.INTEGER,
    povratak_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Povratak',
    tableName: 'povratna_putovanja',
    createdAt: 'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  }),
  associate: (db) => {
    db.models.Povratak.belongsTo(db.models.Rezervacija, {
      foreignKey: 'prva_rezervacija_id',
      as: 'pocetna_rezervacija'
    });
    db.models.Povratak.belongsTo(db.models.Rezervacija, {
      foreignKey: 'povratak_id',
      as: 'povratna_rezervacija'
    });
  }
}

export default Povratak;