const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const User = require('./User');
const Quiz = require('./Quiz');

const UserApp = database.define('UserApp', {
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    approved_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    quiz_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Quiz,
            key: 'id'
        }
    },
    score: { type: DataTypes.INTEGER },
    answer: { type: DataTypes.TEXT },
    created_at: { type: DataTypes.INTEGER },
    updated_at: { type: DataTypes.INTEGER }
}, { tableName: 'user_applications' });

UserApp.belongsTo(User, { foreign_key: 'user_id', as: 'userAppCreatedBy' });
UserApp.belongsTo(User, { foreign_key: 'approved_id', as: 'userAppApprovedBy' });
UserApp.belongsTo(Quiz, { foreign_key: 'quiz_id', as: 'userAppQuiz' });

module.exports = UserApp;