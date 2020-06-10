const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

const RequestAssistance = database.define('RequestAssistance', {
    issuer: { type: DataTypes.STRING(24) },
    handler: { type: DataTypes.STRING(24) },
    timestamp: { type: DataTypes.INTEGER },
    request: { type: DataTypes.STRING(128) },
    close_reason: { type: DataTypes.STRING(128) }
}, { tableName: 'requests_assistance' });

module.exports = RequestAssistance;