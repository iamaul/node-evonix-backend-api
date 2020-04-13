const express = require('express');
const router = express.Router();

const {
    authReqToken,
    authValidation,
    authUser,
    authNewValidation,
    authNewUser,
    authForgotPasswordValidation,
    authForgotPassword,
    authReqForgotPasswordValidation,
    authReqForgotPassword
} = require('../controllers/AuthController');

const auth = require('../middleware/auth');

/**
 * @route   /api/v1/auth
 */
router
    .route('/')
    .get(auth, authReqToken)
    .post(authValidation(), authUser);

/**
 * @route   /api/v1/auth/new
 */
router
    .route('/new')
    .post(authNewValidation(), authNewUser);

/**
 * @route   /api/v1/auth/reset
 */
router
    .route('/reset')
    .post(authForgotPasswordValidation(), authForgotPassword);

/**
 * @route   /api/v1/auth/reset/:code
 */
router
    .route('/reset/:code')
    .get(authReqForgotPasswordValidation(), authReqForgotPassword);

module.exports = router;