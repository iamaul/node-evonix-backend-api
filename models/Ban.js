const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

const Ban = database.define('Ban', {
    account: { type: DataTypes.STRING(24) },
    issuer: { type: DataTypes.STRING(24) },
    reason: { type: DataTypes.STRING(128) },
    timestamp: { type: DataTypes.INTEGER },
    timestamp_expired: { type: DataTypes.INTEGER }
}, { tableName: 'bans' });

module.exports = Ban;