'use strict';
import sequelize from "sequelize";
const DataTypes = sequelize.DataTypes;
const Cenovnik = {
  init: (db) => db.define('Cenovnik', {
    red_voznje_id: DataTypes.INTEGER,
    pocetna_destinacija_id: DataTypes.INTEGER,
    krajnja_destinacija_id: DataTypes.INTEGER,
    cena_jedan_smer:
    {
      type: DataTypes.FLOAT,
      validate:
      {
        isFloat:
        {
          args: true,
          msg: "Cene karata mogu biti samo celi ili decimalni brojevi"
        }
      }
    },
    cena_povratna: DataTypes.FLOAT,
  }, {
    sequelize,
    modelName: 'Cenovnik',
    tableName: 'cenovnici',
    createdAt: 'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  }),
  associate: (db) => {
    db.models.Cenovnik.belongsTo(db.models.Destinacija, {
      foreignKey: 'pocetna_destinacija_id',
      as: 'pocetna_destinacija'
    });
    db.models.Cenovnik.belongsTo(db.models.Destinacija, {
      foreignKey: 'krajnja_destinacija_id',
      as: 'krajnja_destinacija'
    });
    db.models.Cenovnik.belongsTo(db.models.RedVoznje, {
      foreignKey: 'red_voznje_id',
      as: 'red_voznje'
    });
  }
}

export default Cenovnik;
