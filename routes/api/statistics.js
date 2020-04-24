const express = require('express');
const router = express.Router();

const { Op, DataTypes } = require('sequelize');

// Connection
const database = require('../../config/database');

// Middleware
const auth = require('../../middleware/auth');

// Models
const UserModel = require('../../models/User');
const User = UserModel(database, DataTypes);

const VehicleModel = require('../../models/Vehicle');
const Vehicle = VehicleModel(database, DataTypes);

const PropertyModel = require('../../models/Property');
const Property = PropertyModel(database, DataTypes);

/**
 * @route   GET /api/v1/server/stats/users
 * @desc    Count records of users table
 * @access  Public
 */
router.get('/stats/users', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const count = await User.count();
        return res.status(201).json({ status: true, users: count });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            errors: [{
                status: false,
                msg: error.message
            }]
        });
    }
});

/**
 * @route   GET /api/v1/server/stats/player_vehicles
 * @desc    Count records of player's vehicles table
 * @access  Public
 */
router.get('/stats/player_vehicles', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const count = await Vehicle.count({ 
            where: { 
                owner_sqlid: { [Op.not]: 0 }
            } 
        });
        return res.status(201).json({ status: true, player_vehicles: count });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            errors: [{
                status: false,
                msg: error.message
            }]
        });
    }
});

/**
 * @route   GET /api/v1/server/stats/player_properties
 * @desc    Count records of player's properties table
 * @access  Public
 */
router.get('/stats/player_properties', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const count = await Property.count({ 
            where: { 
                owner_sqlid: { [Op.not]: 0 }
            } 
        });
        return res.status(201).json({ status: true, player_properties: count });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            errors: [{
                status: false,
                msg: error.message
            }]
        });
    }
});

module.exports = router;