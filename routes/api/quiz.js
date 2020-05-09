const express = require('express');
const router = express.Router();

const moment = require('moment');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { check, validationResult } = require('express-validator');

// Middleware
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// Models
const User = require('../../models/User');
const Quiz = require('../../models/Quiz');

/**
 * @route   GET /api/v1/quiz
 * @desc    Get all quiz
 * @access  Private
 */
router.get('/', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const result = await Quiz.findAll({ 
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

// /**
//  * @desc    Format upload image file multer
//  */
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/quiz/images/');
//     },
//     filename: (req, file, cb) => {
//         const fileName = file.originalname.toLowerCase().split(' ').join('-');
//         cb(null, uuidv4() + '-' + fileName);
//     }
// });

// const upload = multer({
//     storage,
//     limits: { fileSize: 3000000 },
//     fileFilter: (req, file, cb) => {
//         if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
//             cb(null, true);
//         } else {
//             cb(null, false);
//             return cb(new Error('Only .png, .jpg and .jpeg format are allowed.'));
//         }
//     }
// });

/**
 * @route   POST /api/v1/quiz
 * @desc    Create a quiz
 * @access  Private
 */
router.post('/', [auth, admin, [
    check('title', 'Title is required.')
        .not()
        .isEmpty(),
    check('question', 'Question is required.')
        .not()
        .isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, question, image } = req.body;

    const unix_timestamp = moment().unix();

    try {   
        let quiz = Quiz.build({ 
            title, 
            question, 
            image,
            created_by: req.user.id,
            created_at: unix_timestamp 
        });
        
        // Image file upload
        // if (req.file) {
        //     quiz.image = req.file.filename;
        // }

        quiz = await quiz.save();
        return res.status(201).json(quiz);
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
 * @route   UPDATE /api/v1/quiz/:id
 * @desc    Update a quiz
 * @access  Private
 */
router.put('/:id', [auth, admin, [
    check('title', 'Title is required.')
        .not()
        .isEmpty(),
    check('question', 'Question is required.')
        .not()
        .isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, question, image } = req.body;

    const unix_timestamp = moment().unix();

    try {
        let quiz = await Quiz.findOne({ where: { id: req.params.id } });
        if (!quiz) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The id of quiz that you\'ve selected does not exist.'
                }]
            });
        }

        quiz.title = title;
        quiz.question = question;
        quiz.image = image;
        quiz.created_by = req.user.id;
        quiz.updated_at = unix_timestamp;
        quiz = await quiz.save();

        return res.status(201).json(quiz);
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
 * @route   DELETE /api/v1/quiz/:id
 * @desc    Delete a quiz
 * @access  Private
 */
router.delete('/:id', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await Quiz.destroy({
            where: {
                id: req.params.id
            }
        });

        return res.status(201).json({ status: true, msg: 'Deleted quiz successfully.'});
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