const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const Quiz = require('./Quiz');
const User = require('./User');

const QuizAnswer = database.define('QuizAnswer', {
    quiz_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Quiz,
            key: 'id'
        }
    },
    answer: { type: DataTypes.STRING(100) },
    correct_answer: { type: DataTypes.TINYINT },
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
}, { tableName: 'quiz_answers' });

QuizAnswer.belongsTo(Quiz, { foreignKey: 'quiz_id', as: 'quiz' });
QuizAnswer.belongsTo(User, { foreignKey: 'created_by', as: 'quizAnswerCreatedBy' });
QuizAnswer.belongsTo(User, { foreignKey: 'updated_by', as: 'quizAnswerUpdatedBy' });

module.exports = QuizAnswer;