const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const User = require('./User');

const UserSession = database.define('UserSession', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    code: { type: DataTypes.STRING(129) },
    type: { type: DataTypes.STRING(60) }
}, { tableName: 'user_sessions' });

User.hasMany(UserSession, { foreignKey: 'user_id' });
UserSession.belongsTo(User, { foreignKey: 'user_id' });

module.exports = UserSession;