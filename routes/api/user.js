const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Connection
const database = require('../../config/database');

// Middleware
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// Models
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const UserApp = require('../../models/UserApp');
const Quiz = require('../../models/Quiz');

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
                id: req.user.id
            },
            attributes: ['name', 'email', 'email_verified']
        });

        if (user.email_verified) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'Your email is already verified.'
                }]
            });
        }

        const user_session = UserSession.build({
            user_id: req.user.id,
            code: uuidv4(),
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
router.get('/email/verification/:code', auth, async (req, res) => {
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
                    msg: 'The link does\'nt seems right. We couldn\'t help you to verify your email.'
                }]
            });
        }

        await User.update(
            { email_verified: 1 },
            { where: { id: req.user.id } }
        );

        await UserSession.destroy({
            where: {
                user_id: req.user.id
            }
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
 * @route   PUT /api/v1/users/change/password
 * @desc    Change a new password
 * @access  Private
 */
router.put('/change/password', [auth, [
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
                id: req.user.id
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
            { where: { id: req.user.id } }
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

/**
 * @route   PUT /api/v1/users/change/email
 * @desc    Change a new email
 * @access  Private
 */
router.put('/change/email', [auth, [
    check('new_email', 'Invalid email address.').isEmail()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { new_email } = req.body;

    try {
        const userEmail = await User.findOne({
            where: { email: new_email }
        });

        if (userEmail) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The email that you\'ve entered is already exists.'
                }]
            });
        }

        const user = await User.findOne({
            where: { id: req.user.id }
        });

        const verifiedStatus = user.email_verified ? 0 : 1;

        await User.update({ 
            email: new_email, 
            email_verified: verifiedStatus 
        }, { where: { id: req.user.id } });

        return res.status(201).json({ status: true, msg: 'You have changed a new email.' });
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
 * @route   POST /api/v1/users/application
 * @desc    Submit a user app
 * @access  Private
 */
router.post('/application', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, id, score, answer } = req.body;

    try {
        const unix_timestamp = moment().unix();

        let app = UserApp.build({
            user_id: userId,
            quiz_id: id,
            score,
            answer,
            created_at: unix_timestamp
        });
        await User.update(
            { status: 1 }, 
            { where: { id: app.user_id } }
        );
        await app.save();

        return res.status(201).json({ status: true, msg: 'You have submitted your application.' });
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
 * @route   GET /api/v1/users/application
 * @desc    Get all user apps
 * @access  Private
 */
router.get('/application', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const result = await UserApp.findAll({ 
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                as: 'userAppUser',
                attributes: ['id', 'name', 'status']
            },{
                model: User,
                as: 'userAppAdmin',
                attributes: ['id', 'name']
            },{
                model: Quiz,
                as: 'userAppQuiz',
                attributes: ['title', 'question', 'image']
            }] 
        }); 
        return res.status(201).json(result);
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
 * @route   UPDATE /api/v1/users/application/:confirm/:id
 * @desc    Update a user application
 * @access  Private
 */
router.put('/:confirm/:id', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const unix_timestamp = moment().unix();

    try {
        let user_apps = await UserApp.findOne({ where: { user_id: req.params.id } });
        if (!user_apps) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The id of user apps that you\'ve selected does not exist.'
                }]
            });
        }

        let user = await User.findOne({ where: { id: req.params.id } });
        user.status = (req.params.confirm ? 3 : 2);
        user = await user.save();

        user_apps.admin_id = req.user.id;
        user_apps.updated_at = unix_timestamp;
        user_apps = await user_apps.save();

        const data = { user, user_apps };

        return res.status(201).json(data);
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