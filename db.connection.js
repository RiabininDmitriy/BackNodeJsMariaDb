// const mongoose = require ('mongoose')

//  mongoose.connect('mongodb://localhost:27017/chat', { useNewUrlParser: true});
import Sequelize from 'sequelize'

export const sequelize = new Sequelize('chatMaria', 'root', 'root', {
    dialect: "mariadb",
    port: 3306, 
  });
