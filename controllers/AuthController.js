const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, oneOf, validationResult } = require('express-validator');
const { Op, DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const UserModel = require('../models/User');
const User = UserModel(database, DataTypes);

/**
 * @route   GET /api/v1/auth
 * @desc    Get request user auth
 * @access  Public
 */
exports.authReqToken = async (req, res, next) => {
    try {
        const user = await User.findAll({
            where: {
                id: req.user.userid 
            },
            attributes: {
                exclude: ['password']
            }
        });
        return res.status(201).json({ status: true, user });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            errors: [{
                status: false,
                message: error.message
            }]
        });
    }
}

/**
 * @desc    User authenticate validation
 */
exports.authValidation = () => {
    return [
        oneOf([
            check('usermail')
                .exists()
                .withMessage('Username is required.'),

            check('usermail')
                .isEmail()
                .withMessage('Invalid email address.')
        ]),
        check('password')
            .exists()
            .withMessage('Password is required.')
    ];
}

/**
 * @route   POST /api/v1/auth
 * @desc    Authenticate user along their token
 * @access  Public
 */
exports.authUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { usermail, password } = req.body;

    try {
        // Check if user/email exists
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { name: usermail },
                    { email: usermail }
                ]
            }
        });

        if (!user) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'The username or email that you\'ve entered does not exists.'
                }]
            });
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'The password that you\'ve entered is incorrect.'
                }]
            });
        }

        await User.update(
            { ucp_login_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress },
            { where: { id: user.id } } 
        );

        const payload = {
            user: { 
                userid: user.id,
                admin: user.admin,
                helper: user.helper 
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_TOKEN,
            { expiresIn: 360000 },
            (error, token) => {
                if (error) throw error;
                return res.status(201).json({ status: true, token });
            }
        );
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            errors: [{
                status: false,
                message: error.message
            }]
        });
    }
}

/**
 * @desc    User new authenticate validation
 */
exports.authNewValidation = () => {
    return [
        check('username')
            .exists()
            .withMessage('Username is required.')
            .isLength({ min: 3, max: 20 })
            .withMessage('Username must be between 3-20 characters.')
            .matches(/^[a-zA-Z0-9_.]+$/, 'i')
            .withMessage('Only these characters are allowed (a-z, A-Z, 0-9).'),

        check('email')
            .isEmail()
            .withMessage('Invalid email address.'),

        check('password')
            .exists()
            .withMessage('Password is required.')
            .isLength({ min: 6, max: 20 })
            .withMessage('Password must be at least 6 or 20 characters long.')
    ];
}

/**
 * @route   POST /api/v1/auth/create
 * @desc    Create a new user auth
 * @access  Public
 */
exports.authNewUser = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
        const userName = await User.findOne({
            where: { 
                name: username 
            }
        });

        if (userName) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'The username that you\'ve entered is already exists.'
                }]
            });
        }

        const userEmail = await User.findOne({
            where: { email }
        });

        if (userEmail) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'The email that you\'ve entered is already exists.'
                }]
            });
        }

        let user = User.build({
            name: username,
            email,
            password,
            registered_date: Date.now(),
            admin: 0,
            helper: 0,
            ucp_register_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                userid: user.id,
                admin: user.admin,
                helper: user.helper
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_TOKEN,
            { expiresIn: 360000 },
            (error, token) => {
                if (error) throw error;
                return res.status(201).json({ status: true, token });
            }
        );
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            errors: [{
                status: false,
                message: error.message
            }]
        });
    }
}
