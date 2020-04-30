const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const UserModel = require('../models/User');
const User = UserModel(database, DataTypes);

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('QuizType', {
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
    }, { tableName: 'quiz_types' });
}