const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const UserModel = require('../models/User');
const User = UserModel(database, DataTypes);

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('UserSession', {
        userid: {
            type: DataTypes.INTEGER(11),
            references: {
                model: User,
                key: 'id'
            }
        },
        code: { type: DataTypes.STRING(129) },
        type: { type: DataTypes.STRING(60) }
    }, { tableName: 'user_sessions' });
}