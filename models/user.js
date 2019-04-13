import Sequelize from 'sequelize'
import { sequelize } from '../db.connection'

export class user extends Sequelize.Model{}   
user.init({
  user: Sequelize.STRING,
  password:Sequelize.STRING,
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
}, {
    sequelize,
    timestamps: false,
  });
