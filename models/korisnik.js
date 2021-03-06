'use strict';
import sequelize from 'sequelize'
const DataTypes = sequelize.DataTypes;
const Korisnik = {
  init: (db) => db.define('Korisnik', {
    email:
    {
      type: DataTypes.STRING,
      validate:
      {
        isEmail:
        {
          args: true,
          msg: "Morate uneti e-mail u ispravnom formatu"
        }
      }
    },
    ime:
    {
      type: DataTypes.STRING,
      validate:
      {
        len: {
          args: [3, 40],
          msg: "Ime mora imati između 3 i 40 karaktera",
        }

      }
    },
    prezime:
    {
      type: DataTypes.STRING,
      validate:
      {
        len: {
          args: [3, 40],
          msg: "Prezime mora imati između 3 i 40 karaktera",
        }

      }
    },
    broj_telefona:
    {
      type: DataTypes.STRING,
      validate:
      {
        len: {
          args: [6, 15],
          msg: "Broj telefona mora imati između 6 i 15 karaktera",
        }

      }
    },
    sifra:
    {
      type: DataTypes.STRING,

    },
    tip_naloga:
    {
      type: DataTypes.ENUM,
      values: ['korisnik', 'kondukter', 'vozac', 'prodavac']
    },
  }, {
    sequelize,
    modelName: 'Korisnik',
    tableName: 'korisnici',
    createdAt: 'vreme_kreiranja',
    updatedAt: 'poslednja_izmena',
  }),
  associate: (db) => {

  }
}
export default Korisnik;