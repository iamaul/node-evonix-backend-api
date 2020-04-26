const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const QuizTypeModel = require('../models/QuizType');
const QuizType = QuizTypeModel(database, DataTypes);

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Quiz', {
        quiz_type: {
            type: DataTypes.INTEGER,
            references: {
                model: QuizType,
                key: 'id'
            }
        },
        question: { type: DataTypes.TEXT },
        image: { type: DataTypes.STRING(64) },
        created_at: { type: DataTypes.INTEGER },
        updated_at: { type: DataTypes.INTEGER }
    }, { tableName: 'quizzes' });
}