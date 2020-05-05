const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const User = require('../models/User');

const QuizType = database.define('QuizType', {
    name: { type: DataTypes.STRING(64) },
    active: { type: DataTypes.TINYINT },
    created_by: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    updated_by: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    created_at: { type: DataTypes.INTEGER },
    updated_at: { type: DataTypes.INTEGER }
}, { tableName: 'quiz_types'});

User.hasMany(QuizType, { foreignKey: 'created_by' });
User.hasMany(QuizType, { foreignKey: 'updated_by' });
QuizType.belongsTo(User, { foreignKey: 'created_by' });
QuizType.belongsTo(User, { foreignKey: 'updated_by' });

module.exports = QuizType;