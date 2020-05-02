const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const User = require('./User');

const Property = database.define('Property', {
    owner_sqlid: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    type: { type: DataTypes.TINYINT },
    level: { type: DataTypes.TINYINT },
    price: { type: DataTypes.INTEGER },
    address_number: { type: DataTypes.INTEGER },
    address_name: { type: DataTypes.STRING(64) },
    owner_name: { type: DataTypes.STRING(24) },
    lock_status: { type: DataTypes.TINYINT },
    enter_interior: { type: DataTypes.INTEGER },
    enter_world: { type: DataTypes.INTEGER },
    enter_x: { type: DataTypes.FLOAT },
    enter_y: { type: DataTypes.FLOAT },
    enter_z: { type: DataTypes.FLOAT },
    enter_a: { type: DataTypes.FLOAT },
    exit_interior: { type: DataTypes.INTEGER },
    exit_world: { type: DataTypes.INTEGER },
    exit_x: { type: DataTypes.FLOAT },
    exit_y: { type: DataTypes.FLOAT },
    exit_z: { type: DataTypes.FLOAT },
    exit_a: { type: DataTypes.FLOAT }
}, { tableName: 'property' });

User.hasMany(Property, { foreignKey: 'owner_sqlid' });
Property.belongsTo(User, { foreignKey: 'owner_sqlid' });

module.exports = Property;