import { Sequelize, DataTypes } from "sequelize";
import sequelize from "sequelize";
import database from "../config/config.js";
import * as models from './models.js'
//import povezi from './relacije.js'
const db = new Sequelize(database.development);
//export default db;

Object.keys(models).forEach((model) => {
  if (models[model].init) {
    models[model].init(db);
  }
})
Object.keys(models).forEach((model) => {
  if (models[model].associate) {
   
    models[model].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = Sequelize;
export default db;
