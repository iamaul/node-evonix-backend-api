const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const Character = require('./Character');

const Bizz = database.define('Bizz', {
    owner_sqlid: {
        type: DataTypes.INTEGER,
        references: {
            model: Character,
            key: 'id'
        }
    },
    name: { type: DataTypes.STRING(60) },
    type: { type: DataTypes.TINYINT },
    type_extra: { type: DataTypes.INTEGER },
    buyable: { type: DataTypes.TINYINT },
    price: { type: DataTypes.INTEGER },
    entrance_fee: { type: DataTypes.INTEGER },
    stock: { type: DataTypes.INTEGER },
    owner_name: { type: DataTypes.STRING(24) },
    lock_status: { type: DataTypes.TINYINT },
    money: { type: DataTypes.INTEGER },
    stock_status: { type: DataTypes.TINYINT },
    stock_request: { type: DataTypes.INTEGER },
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
    exit_a: { type: DataTypes.FLOAT },
    point_interior: { type: DataTypes.INTEGER },
    point_world: { type: DataTypes.INTEGER },
    point_x: { type: DataTypes.FLOAT },
    point_y: { type: DataTypes.FLOAT },
    point_z: { type: DataTypes.FLOAT },
    point_a: { type: DataTypes.FLOAT },
    extra_interior: { type: DataTypes.INTEGER },
    extra_world: { type: DataTypes.INTEGER },
    extra_x: { type: DataTypes.FLOAT },
    extra_y: { type: DataTypes.FLOAT },
    extra_z: { type: DataTypes.FLOAT },
    extra_a: { type: DataTypes.FLOAT }
}, { tableName: 'bizz' });

Character.hasMany(Bizz, { foreignKey: 'owner_sqlid', as: 'charBizz' });
Bizz.belongsTo(Character, { foreignKey: 'owner_sqlid', as: 'bizzChar' });

module.exports = Bizz;