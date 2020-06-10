const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

const User = database.define('User', {
    name: { type: DataTypes.STRING(24) },
    password: { type: DataTypes.STRING(129) },
    email: { type: DataTypes.STRING(100) },
    email_verified: { type: DataTypes.TINYINT },
    registered_date: { type: DataTypes.BIGINT },
    register_ip: { type: DataTypes.STRING(16) },
    ucp_login_ip: { type: DataTypes.STRING(16) },
    login_ip: { type: DataTypes.STRING(16) },
    admin: { type: DataTypes.INTEGER },
    admin_division: { type: DataTypes.TINYINT },
    helper: { type: DataTypes.INTEGER },
    lastlogin: { type: DataTypes.INTEGER },
    status: { type: DataTypes.TINYINT },
    delay_character_deletion: { type: DataTypes.INTEGER }
}, { tableName: 'users' });

module.exports = User;