const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const Character = require('./Character');

const AdminWarn = database.define('AdminWarn', {
    char_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Character,
            key: 'id'
        }
    },
    timestamp: { type: DataTypes.INTEGER },
    type: { type: DataTypes.TINYINT },
    issuer: { type: DataTypes.STRING(24) },
    reason: { type: DataTypes.STRING(128) }
}, { tableName: 'admin_warn' });

Character.hasMany(AdminWarn, { foreignKey: 'char_id', as: 'charAdminWarns' });
AdminWarn.belongsTo(Character, { foreignKey: 'char_id', as: 'adminWarnChar' });

module.exports = AdminWarn;