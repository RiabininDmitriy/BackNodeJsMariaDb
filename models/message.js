import Sequelize from 'sequelize'
import { sequelize } from '../db.connection'
import { user } from './user';
import { chatroom } from './chatroom';

export class message extends Sequelize.Model { }
message.init({
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    message: Sequelize.STRING,
}, {
        timestamps: false,
        sequelize,
    });

message.belongsTo(user);
message.belongsTo(chatroom);

user.hasMany(message);
chatroom.hasMany(message);

// "plugins": ["transform-es2015-destructuring", "transform-object-rest-spread"]