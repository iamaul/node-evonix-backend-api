const express = require('express');
const router = express.Router();

const {
    authReqToken,
    authValidation,
    authUser,
    authNewValidation,
    authNewUser
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

module.exports = router;