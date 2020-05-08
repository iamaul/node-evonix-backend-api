const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const User = require('./User');

const Quiz = database.define('Quiz', {
    title: { type: DataTypes.STRING(64) },
    question: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING(100) },
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
}, { tableName: 'quizzes' });

Quiz.belongsTo(User, { foreignKey: 'created_by', as: 'quizCreatedBy' });
Quiz.belongsTo(User, { foreignKey: 'updated_by', as: 'quizUpdatedBy' });

module.exports = Quiz;