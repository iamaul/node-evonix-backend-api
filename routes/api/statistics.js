const express = require('express');
const router = express.Router();

const { Sequelize, Op } = require('sequelize');
const { validationResult } = require('express-validator');

// Middleware
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// Models
const User = require('../../models/User');
const Vehicle = require('../../models/Vehicle');
const Property = require('../../models/Property');
const UserApp = require('../../models/UserApp');
const RequestAssistance = require('../../models/RequestAssistance');
const RequestReport = require('../../models/RequestReport');
const Character = require('../../models/Character');

/**
 * @route   GET /api/v1/server/stats/users
 * @desc    Count records of users table
 * @access  Public
 */
router.get('/stats/users', async (req, res) => {
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
router.get('/stats/player_vehicles', async (req, res) => {
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
router.get('/stats/player_properties', async (req, res) => {
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

/**
 * @route   GET /api/v1/server/stats/user_applications
 * @desc    Count records of user applications
 * @access  Public
 */
router.get('/stats/user_applications', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const count = await UserApp.count();
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
 * @route   GET /api/v1/server/stats/characters
 * @desc    Count records of characters
 * @access  Public
 */
router.get('/stats/characters', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const count = await Character.count();
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
 * @route   GET /api/v1/server/stats/assistances/admin
 * @desc    Count records of assistances table
 * @access  Public
 */
router.get('/stats/assistances/admin', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const assistance = await RequestAssistance.findAll({
            attributes: ['handler', [Sequelize.fn('count', Sequelize.col('handler')), 'count_handler']],
            group: ['handler']
        });
        return res.status(201).json(assistance);
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
 * @route   GET /api/v1/server/stats/assistances
 * @desc    Count records of requests assistance
 * @access  Public
 */
router.get('/stats/assistances', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const count = await RequestAssistance.count();
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
 * @route   GET /api/v1/server/stats/reports/admin
 * @desc    Count records of reports table
 * @access  Public
 */
router.get('/stats/reports/admin', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const report = await RequestReport.findAll({
            attributes: ['handler', [Sequelize.fn('count', Sequelize.col('handler')), 'count_handler']],
            group: ['handler']
        });
        return res.status(201).json(report);
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
 * @route   GET /api/v1/server/stats/reports
 * @desc    Count records of requests report
 * @access  Public
 */
router.get('/stats/reports', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const count = await RequestReport.count();
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
