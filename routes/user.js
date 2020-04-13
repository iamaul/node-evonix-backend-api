const express = require('express');
const router = express.Router();

const {
    userVerifyEmail,
    userConfirmEmailVerification,
    userForgotPasswordValidation,
    userForgotPassword,
    userReqForgotPasswordValidation,
    userReqForgotPassword,
    userChangePasswordValidation,
    userChangePassword
} = require('../controllers/UserController');

const auth = require('../middleware/auth');

/**
 * @route   /api/v1/user/email/verification
 */
router
    .route('/email/verification')
    .post(auth, userVerifyEmail);

/**
 * @route   /api/v1/user/email/verification/:code
 */
router
    .route('/email/verification/:code')
    .post(auth, userConfirmEmailVerification);

/**
 * @route   /api/v1/user/change/password
 */
router
    .route('/change/password')
    .post(auth, userChangePasswordValidation(), userChangePassword);

module.exports = router;