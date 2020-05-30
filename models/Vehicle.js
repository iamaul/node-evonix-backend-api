const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const Character = require('./Character');

const Vehicle = database.define('Vehicle', {
    owner_sqlid: {
        type: DataTypes.INTEGER,
        references: {
            model: Character,
            key: 'id'
        }
    },
    model: { type: DataTypes.INTEGER },
    pos_x: { type: DataTypes.FLOAT },
    pos_y: { type: DataTypes.FLOAT },
    pos_z: { type: DataTypes.FLOAT },
    pos_rot: { type: DataTypes.FLOAT },
    color_1: { type: DataTypes.TINYINT },
    color_2: { type: DataTypes.TINYINT },
    respawn_delay: { type: DataTypes.INTEGER },
    siren: { type: DataTypes.TINYINT },
    world: { type: DataTypes.INTEGER },
    interior: { type: DataTypes.INTEGER },
    faction_sqlid: { type: DataTypes.INTEGER },
    rental_sqlid: { type: DataTypes.INTEGER },
    rental_timer: { type: DataTypes.INTEGER },
    rental_price: { type: DataTypes.INTEGER },
    name: { type: DataTypes.STRING(32) },
    lock_status: { type: DataTypes.TINYINT },
    save_x: { type: DataTypes.FLOAT },
    save_y: { type: DataTypes.FLOAT },
    save_z: { type: DataTypes.FLOAT },
    save_rot: { type: DataTypes.FLOAT },
    save_world: { type: DataTypes.INTEGER },
    save_interior: { type: DataTypes.INTEGER },
    damage_panels: { type: DataTypes.INTEGER },
    damage_doors: { type: DataTypes.INTEGER },
    damage_lights: { type: DataTypes.INTEGER },
    damage_tires: { type: DataTypes.INTEGER },
    health: { type: DataTypes.FLOAT },
    max_health: { type: DataTypes.FLOAT },
    mileage: { type: DataTypes.FLOAT },
    fuel: { type: DataTypes.FLOAT },
    number_plate: { type: DataTypes.STRING(32) },
    component: { type: DataTypes.INTEGER }
}, { tableName: 'vehicles' });

Character.hasMany(Vehicle, { foreignKey: 'owner_sqlid', as: 'charVehicles' });
Vehicle.belongsTo(Character, { foreignKey: 'owner_sqlid', as: 'vehicleChar' });

module.exports = Vehicle;