const express = require('express');
const router = express.Router();

const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const moment = require('moment');
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');
const { Op } = require('sequelize');

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
                                    <img src="http://101.50.3.61:3000/assets/images/evonix-logo.png" />
                                    <span class="preheader" style="color: transparent; display: none; height: 0; max-height: 0; max-width: 0; opacity: 0; overflow: hidden; mso-hide: all; visibility: hidden; width: 0;">This is preheader text. Some clients will show this text as a preview.</span>
                                    <table class="main" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; background: #ffffff; border-radius: 3px;">
                                        <!-- START MAIN CONTENT AREA -->
                                        <tr>
                                            <td class="wrapper" style="font-family: sans-serif; font-size: 14px; vertical-align: top; box-sizing: border-box; padding: 20px;">
                                                <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%;">
                                                    <tr>
                                                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top;">
                                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">Hi <b>${user.name}</b>,</p>
                                                            <p style="font-family: sans-serif; font-size: 14px; font-weight: normal; margin: 0; Margin-bottom: 15px;">To verify your email, please click the following link below:</p>
                                                            <table border="0" cellpadding="0" cellspacing="0" class="btn btn-primary" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: 100%; box-sizing: border-box;">
                                                                <tbody>
                                                                    <tr>
                                                                        <td align="left" style="font-family: sans-serif; font-size: 14px; vertical-align: top; padding-bottom: 15px;">
                                                                            <table border="0" cellpadding="0" cellspacing="0" style="border-collapse: separate; mso-table-lspace: 0pt; mso-table-rspace: 0pt; width: auto;">
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td style="font-family: sans-serif; font-size: 14px; vertical-align: top; background-color: #ff0000; border-radius: 5px; text-align: center;"> 
                                                                                            <a href="http://101.50.3.61:3000/email/verification/${user_session.code}" target="_blank" style="display: inline-block; color: #ffffff; background-color: #ff0000; border: solid 1px #ff0000; border-radius: 5px; box-sizing: border-box; cursor: pointer; text-decoration: none; font-size: 14px; font-weight: bold; margin: 0; padding: 12px 25px; text-transform: capitalize; border-color: #ff0000;">
                                                                                                Confirm Email Verification
                                                                                            </a>
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                            </table>
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
                                                    <span class="apple-link" style="color: #999999; font-size: 12px; text-align: center;">Copyright &copy; 2020 EvoniX Community.</span>
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
 * @route   PUT /api/v1/users/email/verification/:code
 * @desc    Confirm email verification
 * @access  Private
 */
router.put('/email/verification/:code', auth, async (req, res) => {
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
                    msg: 'The email that you\'ve entered is already exist.'
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
        await User.update({
            status: 1
        }, { where: { id: userId } });
        await app.save();

        return res.status(201).json({ status: true, msg: 'Submitting your application ...' });
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
                attributes: ['name']
            },{
                model: User,
                as: 'userAppAdmin',
                attributes: ['name']
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
 * @route   PUT /api/v1/users/application/:status/:id/:user_id
 * @desc    Update a user application
 * @access  Private
 */
router.put('/application/:status/:id/:user_id', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const unix_timestamp = moment().unix();

    try {
        let user_app = await UserApp.findOne({ where: { id: req.params.id } });

        if (!user_app) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The id of user application you\'ve selected does not exist.'
                }]
            });
        }

        await User.update({ 
            status: req.params.status
        }, { where: { id: req.params.user_id } });

        user_app.admin_id = req.user.id;
        user_app.status = req.params.status;
        user_app.updated_at = unix_timestamp;
        await user_app.save();
        
        const result = await UserApp.findAll({
            order: [['updated_at', 'DESC']],
            include: [{
                model: User,
                as: 'userAppUser',
                attributes: ['name']
            },{
                model: User,
                as: 'userAppAdmin',
                attributes: ['name']
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

module.exports = router;