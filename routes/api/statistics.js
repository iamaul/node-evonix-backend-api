const express = require('express');
const router = express.Router();

const { Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Middleware
const auth = require('../../middleware/auth');

// Models
const User = require('../../models/User');
const Vehicle = require('../../models/Vehicle');
const Property = require('../../models/Property');

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
        return res.status(201).json(count);
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
        return res.status(201).json(count);
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
        return res.status(201).json(count);
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