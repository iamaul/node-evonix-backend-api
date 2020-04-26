const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const QuizModel = require('../models/Quiz');
const Quiz = QuizModel(database, DataTypes);

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('QuizAnswer', {
        quiz_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Quiz,
                key: 'id'
            }
        },
        answer: { type: DataTypes.STRING(40) },
        correct_answer: { type: DataTypes.TINYINT },
        created_at: { type: DataTypes.INTEGER },
        updated_at: { type: DataTypes.INTEGER }
    }, { tableName: 'quiz_answers' });
}