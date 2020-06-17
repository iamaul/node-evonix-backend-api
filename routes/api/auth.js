const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');

// Middleware
const auth = require('../../middleware/auth');

// Models
const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

/**
 * @route   GET /api/v1/auth
 * @desc    Get request user auth token
 * @access  Public
 */
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findOne({
            where: { id: req.user.id },
            attributes: {
                exclude: ['password']
            }
        });
        return res.status(201).json(user);
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
 * @route   POST /api/v1/auth
 * @desc    Authenticate user along their token
 * @access  Public
 */
router.post('/', [
    check('usermail', 'Username is required.').not().isEmpty(),
    check('password', 'Password is required.').exists()
], async (req, res) => {
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
                    msg: 'The username or email address that you\'ve entered does not exist.'
                }]
            });
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The password that you\'ve entered is incorrect.'
                }]
            });
        }

        await User.update(
            { ucp_login_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress },
            { where: { id: user.id } } 
        );

        const payload = {
            user: { 
                id: user.id,
                admin: user.admin,
                helper: user.helper
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_TOKEN,
            { expiresIn: '24h' },
            (error, token) => {
                if (error) throw error;
                return res.status(201).json({ token });
            }
        );
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
 * @route   POST /api/v1/auth/admin
 * @desc    Authenticate users admin along their token
 * @access  Public
 */
router.post('/admin', [
    check('usermail', 'Username is required.').not().isEmpty(),
    check('password', 'Password is required.').exists()
], async (req, res) => {
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
            },
            attributes: ['admin', 'helper']
        });

        if (!user) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The username or email address that you\'ve entered does not exist.'
                }]
            });
        }

        if (user.admin === 0) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'You\'re not authorized to access this page.'
                }]
            });
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The password that you\'ve entered is incorrect.'
                }]
            });
        }

        await User.update(
            { ucp_login_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress },
            { where: { id: user.id } } 
        );

        const payload = {
            user: { 
                id: user.id,
                admin: user.admin,
                helper: user.helper
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_TOKEN,
            { expiresIn: '24h' },
            (error, token) => {
                if (error) throw error;
                return res.status(201).json({ token });
            }
        );
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
 * @route   POST /api/v1/auth/new
 * @desc    Create a new user auth
 * @access  Public
 */
router.post('/new', [
    check('username', 'Username is required.')
        .not()
        .isEmpty()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be between 3-20 characters.')
        .matches(/^[a-zA-Z0-9_.]+$/, 'i')
        .withMessage('Only these characters are allowed (a-z, A-Z, 0-9, _underscore, .dot).'),
    check('email', 'Invalid email address.').isEmail(),
    check('password', 'Password is required.')
        .exists()
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be at least 6 or 20 characters long.')
], async (req, res) => {
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
                    msg: 'The username that you\'ve entered is already exist.'
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
                    msg: 'The email address that you\'ve entered is already exist.'
                }]
            });
        }

        const unix_timestamp = moment().unix();

        let user = User.build({
            name: username,
            email,
            password,
            registered_date: unix_timestamp,
            admin: 0,
            helper: 0,
            register_ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
        });

        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id,
                admin: user.admin,
                helper: user.helper
            }
        }

        jwt.sign(
            payload,
            process.env.JWT_TOKEN,
            { expiresIn: '24h' },
            (error, token) => {
                if (error) throw error;
                return res.status(201).json({ token });
            }
        );
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
 * @route   POST /api/v1/auth/reset
 * @desc    Forgot password
 * @access  Public
 */
router.post('/reset', [
    check('email', 'Invalid email address.').isEmail()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    try {
        const user = await User.findOne({
            where: { email },
            attributes: ['id', 'name', 'email_verified']
        });

        if (!user) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The email address that you\'ve entered does not exist.'
                }]
            });
        }
        
        if (user.email_verified === 0) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'That email is not verified yet.'
                }]
            });
        }

        const user_session = UserSession.build({
            user_id: user.id,
            code: uuidv4(),
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
            from: 'EvoniX UCP <no-reply@evonix-rp.com>',
            subject: 'Forgot Password 🔒',
            html: `
                <!doctype html>
                <html>
                <head>
                    <meta name="viewport" content="width=device-width">
                    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                    <style>
                        @media only screen and (max-width: 620px) {
                            table[class=body] h1 {
                                font-size: 28px !important;
                                margin-bottom: 10px !important;
                            }
                            table[class=body] p,
                                    table[class=body] ul,
                                    table[class=body] ol,
                                    table[class=body] td,
                                    table[class=body] span,
                                    table[class=body] a {
                                font-size: 16px !important;
                            }
                            table[class=body] .wrapper,
                                    table[class=body] .article {
                                padding: 10px !important;
                            }
                            table[class=body] .content {
                                padding: 0 !important;
                            }
                            table[class=body] .container {
                                padding: 0 !important;
                                width: 100% !important;
                            }
                            table[class=body] .main {
                                border-left-width: 0 !important;
                                border-radius: 0 !important;
                                border-right-width: 0 !important;
                            }
                            table[class=body] .btn table {
                                width: 100% !important;
                            }
                            table[class=body] .btn a {
                                width: 100% !important;
                            }
                            table[class=body] .img-responsive {
                                height: auto !important;
                                max-width: 100% !important;
                                width: auto !important;
                            }
                        }
                        /* -------------------------------------
                            PRESERVE THESE STYLES IN THE HEAD
                        ------------------------------------- */
                        @media all {
                            .ExternalClass {
                                width: 100%;
                            }
                            .ExternalClass,
                            .ExternalClass p,
                            .ExternalClass span,
                            .ExternalClass font,
                            .ExternalClass td,
                            .ExternalClass div {
                                line-height: 100%;
                            }
                            .apple-link a {
                                color: inherit !important;
                                font-family: inherit !important;
                                font-size: inherit !important;
                                font-weight: inherit !important;
                                line-height: inherit !important;
                                text-decoration: none !important;
                            }
                            #MessageViewBody a {
                                color: inherit;
                                text-decoration: none;
                                font-size: inherit;
                                font-family: inherit;
                                font-weight: inherit;
                                line-height: inherit;
                            }
                        }
                    </style>
                </head>
                <body style="background-color: #f6f6f6; font-family: sans-serif; -webkit-font-smoothing: antialiased; font-size: 14px; line-height: 1.4; margin: 0; padding: 0; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;">
                    <table border="0" cellpadding="0" cellspacing="0" class="body" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background-color: #f6f6f6;">
                        <tr>
                            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                            <td class="container" style="font-family: sans-serif; font-size: 14px; vertical-align: top; display: block; Margin: 0 auto; max-width: 580px; padding: 10px; width: 580px;">
                                <div class="content" style="box-sizing: border-box; display: block; Margin: 0 auto; max-width: 580px; padding: 10px;">
                                    <!-- START CENTERED WHITE CONTAINER -->
                                    <img src="https://ucp.evonix-rp.com/assets/images/evonix-logo.png" />
                                    <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">Hi ${user.name}, you have requested a reset password link.</span>
                                    <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
                                        <!-- START MAIN CONTENT AREA -->
                                        <tr>
                                            <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                                    <tr>
                                                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi <b>${user.name}</b>,</p>
                                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">To change a new password, please click the following link below:</p>
                                                            <p><a href="https://ucp.evonix-rp.com/reset/password/${user_session.code}">Change New Password</a></p>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </td>
                                        </tr>
                                        <!-- END MAIN CONTENT AREA -->
                                    </table>
                                    <!-- START FOOTER -->
                                    <div class="footer" style="clear: both; Margin-top: 10px; text-align: center; width: 100%;">
                                        <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                            <tr>
                                                <td class="content-block" style="font-family: sans-serif; vertical-align: top; padding-bottom: 10px; padding-top: 10px; font-size: 12px; color: #999999; text-align: center;">
                                                    <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright &copy; 2020 EvoniX UCP.</span>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <!-- END FOOTER -->
                                <!-- END CENTERED WHITE CONTAINER -->
                                </div>
                            </td>
                            <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">&nbsp;</td>
                        </tr>
                    </table>
                </body>
                </html>
            `
        }
        await transporter.sendMail(message);

        return res.status(201).json({ status: true, msg: 'We\'ve sent an email to you, please check your email in Inbox or Spam.' });
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
 * @route   GET /api/v1/auth/reset/:code
 * @desc    Verify user request a new password link
 * @access  Public
 */
router.get('/reset/:code', async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user_session = await UserSession.findOne({
            where: {
                [Op.and]: [
                    { code: req.params.code },
                    { type: 'forgot_password' }
                ]
            }
        });

        if (!user_session) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The page link is invalid or session has been expired.'
                }]
            });
        }

        return res.status(201).json({ status: true, msg: 'The page link you\'ve accessed is valid.' });
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
 * @route   PUT /api/v1/auth/reset/:code
 * @desc    User request a new password
 * @access  Public
 */
router.put('/reset/:code', [
    check('password')
        .exists()
        .withMessage('Password is required.')
        .isLength({ min: 6, max: 20 })
        .withMessage('Password must be at least 6 or 20 characters long.')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { password } = req.body;

    try {
        const user_session = await UserSession.findOne({
            where: {
                [Op.and]: [
                    { code: req.params.code },
                    { type: 'forgot_password' }
                ]
            },
            attributes: ['user_id']
        });

        if (!user_session) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The link page is invalid or session has been expired.'
                }]
            });
        }

        const salt = await bcrypt.genSalt(12);
        const new_password = await bcrypt.hash(password, salt);

        await User.update({ 
            password: new_password 
        }, { where: { id: user_session.user_id } });
        
        await UserSession.destroy({
            where: {
                user_id: user_session.user_id
            }
        });

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

module.exports = router;