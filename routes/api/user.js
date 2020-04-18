const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const uuid = require('uuid');
const { check, validationResult } = require('express-validator');
const { Op, DataTypes } = require('sequelize');

// Connection
const database = require('../../config/database');

// Middleware
const auth = require('../../middleware/auth');

// Models
const UserModel = require('../../models/User');
const User = UserModel(database, DataTypes);

const UserSessionModel = require('../../models/UserSession');
const UserSession = UserSessionModel(database, DataTypes);

/**
 * @route   POST /api/v1/users/email/verification
 * @desc    Verify user email
 * @access  Private
 */
router.post('/email/verification', auth, async (req, res) => {
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
                    msg: 'Your email is verified.'
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
            `http://dev.evonix-rp.com/api/v1/users/email/verification/${user_session.code}`
        }
        await transporter.sendMail(message);

        return res.status(201).json({ status: true, msg: 'We\'ve sent an email verification to you, please check your email in Inbox or Spam.' });
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
 * @route   GET /api/v1/users/email/verification/:code
 * @desc    Confirm email verification
 * @access  Private
 */
router.post('/email/verification/:code', auth, async (req, res) => {
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
                    msg: 'The link does\'nt seems right. We couldn\'t help you to verify email.'
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

        return res.status(201).json({ status: true, msg: 'You\'ve successfully verified your email account.' });
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
 * @route   POST /api/v1/users/change/password
 * @desc    Change a new password
 * @access  Private
 */
router.post('/change/password', [auth, [
    check('old_password', 'Old password is required.').not().isEmpty(),
    check('password')
        .exists()
        .withMessage('Password is required.')
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be at least 6 or 20 characters long.')
]], async (req, res) => {
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
                    msg: 'Incorrect old password.'
                }]
            });
        }

        const salt = await bcrypt.genSalt(12);
        const new_password = await bcrypt.hash(password, salt);

        await User.update(
            { password: new_password },
            { where: { id: req.user.userid } }
        );

        return res.status(201).json({ status: true, msg: 'You have changed a new password.' });
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