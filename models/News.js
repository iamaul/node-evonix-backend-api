const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const User = require('./User');

const News = database.define('News', {
    title: { type: DataTypes.STRING(40) },
    slug: { type: DataTypes.STRING(55) },
    content: { type: DataTypes.TEXT },
    image: { type: DataTypes.STRING(45) },
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
}, { tableName: 'news' });

News.belongsTo(User, { foreignKey: 'created_by', as: 'newsCreatedBy' });
News.belongsTo(User, { foreignKey: 'updated_by', as: 'newsUpdatedBy' });

module.exports = News;