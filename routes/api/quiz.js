const express = require('express');
const router = express.Router();

const moment = require('moment');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');
const { DataTypes } = require('sequelize');

// Connection
const database = require('../../config/database');

// Middleware
const auth = require('../../middleware/auth');

// Models
const QuizTypeModel = require('../../models/QuizType');
const QuizType = QuizTypeModel(database, DataTypes);

const QuizModel = require('../../models/Quiz');
const Quiz = QuizModel(database, DataTypes);

const QuizAnswerModel = require('../../models/QuizAnswer');
const QuizAnswer = QuizAnswerModel(database, DataTypes);


/**
 * @desc    Format upload image file multer
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/quiz/images/');
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(null, false);
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'Only .png, .jpg and .jpeg format are allowed.'
                }]
            });
        }
    }
});

/**
 * @route   POST /api/v1/quiz
 * @desc    Create a quiz
 * @access  Private
 */
router.post('/', [auth, upload.single('image'), [
    check('quiz_type_id', 'Quiz type is required.')
        .not()
        .isEmpty()
        .isNumeric()
        .withMessage('Quiz type must be a number.'),
    check('question', 'Question is required.')
        .not()
        .isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { quiz_type_id, question } = req.body;

    const unix_timestamp = moment().unix();

    try {   
        let quiz = Quiz.build({ quiz_type_id, question, created_at: unix_timestamp, updated_at: unix_timestamp });
        
        // Image file upload
        if (req.file) {
            quiz.image = req.file.filename;
        }

        await quiz.save();
        return res.status(201).json({ status: true, result: quiz, msg: 'Created quiz successfully.' });
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
 * @route   POST /api/v1/quiz/types
 * @desc    Create a quiz types
 * @access  Private
 */
router.post('/types', [auth, [
    check('name', 'Name is required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    const unix_timestamp = moment().unix();

    try {
        const quiz_type = await QuizType.create({ name, created_at: unix_timestamp, updated_at: unix_timestamp });
        return res.status(201).json({ status: true, result: quiz_type, msg: 'Created quiz type successfully.' });
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
 * @route   POST /api/v1/quiz/answers
 * @desc    Create a quiz answers
 * @access  Private
 */
router.post('/answers', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // const unix_timestamp = moment().unix();

    return res.status(201).json(req.body);

    // try {
    //     return res.status(201).json({ status: true, result: req.body });
    // } catch (error) {
    //     console.error(error.message);
    //     return res.status(500).json({
    //         errors: [{
    //             status: false,
    //             msg: error.message
    //         }]
    //     });
    // }
});

module.exports = router;