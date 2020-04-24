const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const UserModel = require('../models/User');
const User = UserModel(database, DataTypes);

module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Vehicle', {
        owner_sqlid: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id'
            },
            unique: true
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
        fuel: { type: DataTypes.FLOAT },
        number_plate: { type: DataTypes.STRING(32) }
    }, { tableName: 'vehicles' });
}
