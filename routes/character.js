const express = require('express');
const router = express.Router();

const {
    getUserChars,
    createCharValidation,
    createChar
} = require('../controllers/CharacterController');

const auth = require('../middleware/auth');

/**
 * @route   /api/v1/characters
 */
router
    .route('/')
    .get(auth, getUserChars);

/**
 * @route   /api/v1/characters/create
 */
router
    .route('/create')
    .post(auth, createCharValidation(), createChar);

module.exports = router;