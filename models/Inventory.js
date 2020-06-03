const { DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const Character = require('./Character');

const Inventory = database.define('Inventory', {
    char_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Character,
            key: 'id'
        }
    },
    name: { type: DataTypes.STRING(32) },
    amount: { type: DataTypes.INTEGER }
}, { tableName: 'inventory_player' });

Character.hasMany(Inventory, { foreignKey: 'char_id', as: 'charInventory' });
Inventory.belongsTo(Character, { foreignKey: 'char_id', as: 'inventoryChar' });

module.exports = Inventory;