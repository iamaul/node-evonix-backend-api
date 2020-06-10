const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

const RequestReport = database.define('RequestReport', {
    issuer: { type: DataTypes.STRING(24) },
    handler: { type: DataTypes.STRING(24) },
    timestamp: { type: DataTypes.INTEGER },
    text: { type: DataTypes.STRING(128) }
}, { tableName: 'requests_report' });

module.exports = RequestReport;