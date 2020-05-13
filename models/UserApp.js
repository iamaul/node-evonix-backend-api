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
    admin_id: {
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

UserApp.belongsTo(User, { foreignKey: 'user_id', as: 'users' });
UserApp.belongsTo(User, { foreignKey: 'admin_id', as: 'admins' });
UserApp.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quizzes' });

module.exports = UserApp;