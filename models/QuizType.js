module.exports = (sequelize, DataTypes) => {
    return sequelize.define('QuizType', {
        name: { type: DataTypes.STRING(64) },
        active: { type: DataTypes.TINYINT },
        created_at: { type: DataTypes.INTEGER },
        updated_at: { type: DataTypes.INTEGER }
    }, { tableName: 'quiz_types' });
}