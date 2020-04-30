const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const QuizTypeModel = require('../models/QuizType');
const QuizType = QuizTypeModel(database, DataTypes);

const UserModel = require('../models/User');
const User = UserModel(database, DataTypes);

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Quiz', {
        quiz_type_id: {
            type: DataTypes.INTEGER,
            references: {
                model: QuizType,
                key: 'id'
            }
        },
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
}