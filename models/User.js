const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

const User = database.define('User', {
    name: { type: DataTypes.STRING(24) },
    email: { type: DataTypes.STRING(100) },
    email_verified: { type: DataTypes.TINYINT },
    password: { type: DataTypes.STRING(129) },
    registered_date: { type: DataTypes.BIGINT },
    admin: { type: DataTypes.INTEGER },
    helper: { type: DataTypes.INTEGER },
    status: { type: DataTypes.TINYINT },
    lastlogin: { type: DataTypes.INTEGER },
    delay_character_deletion: { type: DataTypes.INTEGER },
    register_ip: { type: DataTypes.STRING(20) },
    login_ip: { type: DataTypes.STRING(20) },
    ucp_login_ip: { type: DataTypes.STRING(20) }
}, { tableName: 'users' });

module.exports = User;