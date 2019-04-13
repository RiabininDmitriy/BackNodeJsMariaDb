import Sequelize from 'sequelize'
import { sequelize } from '../db.connection'

export class chatroom extends Sequelize.Model {}
chatroom.init({
   chatroom: Sequelize.STRING,
   id: {type:Sequelize.INTEGER, primaryKey:true},
}, {
  sequelize,
  timestamps:false,
});
