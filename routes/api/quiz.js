const express = require('express');
const router = express.Router();

const moment = require('moment');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');

// Connection
const database = require('../../config/database');

// Middleware
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// Models
const User = require('../../models/User');
const QuizType = require('../../models/QuizType');
const Quiz = require('../../models/Quiz');
const QuizAnswer = require('../../models/QuizAnswer');

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
router.post('/', [auth, admin, upload.single('image'), [
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
        let quiz = Quiz.build({ 
            quiz_type_id, 
            question, 
            created_by: req.user.id,
            created_at: unix_timestamp 
        });
        
        // Image file upload
        if (req.file) {
            quiz.image = req.file.filename;
        }

        await quiz.save();
        return res.status(201).json({ status: true, msg: 'Created quiz successfully.', result: quiz });
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
 * @route   GET /api/v1/quiz/type
 * @desc    Get all quiz type
 * @access  Private
 */
router.get('/type', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const result = await QuizType.findAll({ 
            order: [['created_at', 'DESC']],
            include: [{ 
                model: User, 
                as: 'quizCreatedBy',
                attributes: ['name'] 
            },{
                model: User,
                as: 'quizUpdatedBy',
                attributes: ['name']
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
 * @route   POST /api/v1/quiz/type
 * @desc    Create a quiz type
 * @access  Private
 */
router.post('/type', [auth, admin, [
    check('name', 'Name is required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, active } = req.body;

    const unix_timestamp = moment().unix();

    try {
        const quiz_type = await QuizType.create({ 
            name, 
            active,
            created_by: req.user.id,
            created_at: unix_timestamp 
        });
        return res.status(201).json({ status: true, msg: 'Created quiz type successfully.', quiz_type });
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
 * @route   PUT /api/v1/quiz/type/:id
 * @desc    Update a quiz type
 * @access  Private
 */
router.put('/type/:id', [auth, admin, [
    check('name', 'Name is required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, active } = req.body;

    const unix_timestamp = moment().unix();

    try {
        const quiz_type = await QuizType.update({ 
            name,
            active,
            updated_by: req.user.id, 
            updated_at: unix_timestamp 
        }, { where: { id: req.params.id } });

        return res.status(201).json({ status: true, msg: 'Updated quiz type successfully.', quiz_type });
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
 * @route   DELETE /api/v1/quiz/type/:id
 * @desc    Delete a quiz type
 * @access  Private
 */
router.delete('/type/:id', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await QuizType.destroy({
            where: {
                id: req.params.id
            }
        });

        return res.status(201).json({ status: true, msg: 'Deleted quiz type successfully.'});
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
 * @route   POST /api/v1/quiz/answer
 * @desc    Create a quiz answer
 * @access  Private
 */
router.post('/answer', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const unix_timestamp = moment().unix();

    const answers = req.body.map(obj => {
        const container = {};

        container.quiz_id = obj.quiz_id;
        container.answer = obj.answer;
        container.correct_answer = obj.correct_answer;
        container.created_by = req.user.id;
        container.created_at = unix_timestamp;

        return container;
    });

    try {
        const result = await QuizAnswer.bulkCreate(answers);
        return res.status(201).json({ status: true, msg: 'Created quiz answer successfully.', result });
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
 * @route   PUT /api/v1/quiz/answer
 * @desc    Create a quiz answer
 * @access  Private
 */
router.put('/answer', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const unix_timestamp = moment().unix();

    const answers = req.body.map(obj => {
        const container = {};

        container.quiz_id = obj.quiz_id;
        container.answer = obj.answer;
        container.correct_answer = obj.correct_answer;
        container.updated_by = req.user.id;
        container.updated_at = unix_timestamp;

        return container;
    });

    try {
        const result = await QuizAnswer.bulkCreate(answers, { updateOnDuplicate: ['quiz_id', 'answer', 'correct_answer', 'updated_by', 'updated_at'] });
        return res.status(201).json({ status: true, msg: 'Updated quiz answer successfully.', result });
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
 * @route   DELETE /api/v1/quiz/answer/:id
 * @desc    Delete a quiz answer
 * @access  Private
 */
router.delete('/answer/:id', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await QuizAnswer.destroy({
            where: {
                id: req.params.id
            }
        });

        return res.status(201).json({ status: true, msg: 'Deleted quiz answer successfully.'});
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