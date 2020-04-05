const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const { check, oneOf, validationResult } = require('express-validator');
const { Op, DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Models
const UserModel = require('../models/User');
const User = UserModel(database, DataTypes);

const UserSessionModel = require('../models/UserSession');
const UserSession = UserSessionModel(database, DataTypes);

/**
 * @route   POST /api/v1/users/email/verification
 * @desc    Verify user email
 * @access  Private
 */
exports.userVerifyEmail = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await User.findOne({
            where: {
                id: req.user.userid
            },
            attributes: ['name', 'email', 'email_verified']
        });

        if (user.email_verified) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'Your email is verified.'
                }]
            });
        }

        const user_session = UserSession.build({
            userid: req.user.userid,
            code: uuid.v4(),
            type: 'email_verification'
        });

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const message = {
            to: user.email,
            from: 'EvoniX Roleplay UCP <no-reply@evonix-rp.com>',
            subject: 'Email Verification ✅',
            html: `<p>Hey ${user.name},<br><br>To verify your email, please click the following link below:<br>` +
            `http://103.129.222.3:5000/api/v1/users/email/verification/${user_session.code}`
        }
        await transporter.sendMail(message);

        return res.status(201).json({ status: true, message: 'We\'ve sent an email verification to you, please check your email in Inbox or Spam.' });
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
 * @route   GET /api/v1/users/email/verification/:code
 * @desc    Confirm email verification
 * @access  Private
 */
exports.userConfirmEmailVerification = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user_session = UserSession.findOne({
            where: {
                [Op.and]: [
                    { code: req.params.code },
                    { type: 'email_verification' }
                ]
            }
        });

        if (!user_session) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'The link does\'nt seems right. We couldn\'t help you to verify email.'
                }]
            });
        }

        await User.update(
            { email_verified: 1 },
            { where: { id: req.user.userid } }
        );

        await UserSession.destroy({
            where: {
                userid: req.user.userid
            },
            truncate: true
        });

        return res.status(201).json({ status: true, message: 'You\'ve successfully verified your email account.' });
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
 * @desc    User forgot password validation
 */
exports.userForgotPasswordValidation = () => {
    return [
        oneOf([
            check('email')
                .exists()
                .withMessage('Email is required.'),

            check('email')
                .isEmail()
                .withMessage('Invalid email address.')
        ])
    ];
}

/**
 * @route   POST /api/v1/users/forgot/password
 * @desc    Forgot password
 * @access  Public
 */
exports.userForgotPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({
            where: {
                email: email
            },
            attributes: ['id', 'name']
        });

        if (!user) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'The email address that you\'ve entered does not exists.'
                }]
            });
        }

        const user_session = UserSession.build({
            userid: user.id,
            code: uuid.v4(),
            type: 'forgot_password'
        });
        await user_session.save();

        let transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });

        const message = {
            to: email,
            from: 'EvoniX Roleplay UCP <no-reply@evonix-rp.com>',
            subject: 'Forgot Password 🔒',
            html: `<p>Hey ${user.name},<br><br>To change a new password, please click the following link below:<br>` +
            `http://103.129.222.3:5000/api/v1/user/forgot/password/${user_session.code}`
        }
        await transporter.sendMail(message);

        return res.status(201).json({ status: true, message: 'We\'ve sent an email to you, please check your email in Inbox or Spam.' });
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
 * @desc    User request a new password validation
 */
exports.userReqForgotPasswordValidation = () => {
    return [
        check('password')
            .exists()
            .withMessage('Password is required.')
            .isLength({ min: 6, max: 20 })
            .withMessage('Password must be at least 6 or 20 characters long.')
    ];
}

/**
 * @route   GET /api/v1/users/forgot/password/:code
 * @desc    User request a new password
 * @access  Public
 */
exports.userReqForgotPassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;

    try {
        const user_session = UserSession.findOne({
            where: {
                [Op.and]: [
                    { code: req.params.code },
                    { type: 'forgot_password' }
                ]
            },
            attributes: ['userid']
        });

        if (!user_session) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'The link does\'nt seems right. We couldn\'t help you to request a new password.'
                }]
            });
        }

        const salt = await bcrypt.genSalt(12);
        const new_password = await bcrypt.hash(password, salt);

        await User.update(
            { password: new_password },
            { where: { id: user_session.userid } }
        );
        
        await UserSession.destroy({
            where: {
                userid: user_session.userid
            },
            truncate: true
        });

        return res.status(201).json({ status: true, message: 'You have changed a new password.' });
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
 * @desc    User change a new password validation
 */
exports.userChangePasswordValidation = () => {
    return [
        check('old_password', 'Old password is required.').not().isEmpty(),
        check('password')
            .exists()
            .withMessage('Password is required.')
            .isLength({ min: 6, max: 20 })
            .withMessage('Password must be at least 6 or 20 characters long.')
    ];
}

/**
 * @route   POST /api/v1/users/change/password
 * @desc    Change a new password
 * @access  Private
 */
exports.userChangePassword = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { old_password, password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                id: req.user.userid
            }
        });

        const password_verify = await bcrypt.compare(old_password, user.password);
        if (!password_verify) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'Incorrect old password.'
                }]
            });
        }

        const salt = await bcrypt.genSalt(12);
        const new_password = await bcrypt.hash(password, salt);

        await User.update(
            { password: new_password },
            { where: { id: req.user.userid } }
        );

        return res.status(201).json({ status: true, message: 'You have changed a new password.' });
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