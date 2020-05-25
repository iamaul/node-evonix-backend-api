const express = require('express');
const router = express.Router();

const moment = require('moment');
const slugify = require('slugify');
const { check, validationResult } = require('express-validator');

// Middleware
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// Models
const News = require('../../models/News');
const User = require('../../models/User');

/**
 * @route   GET /api/v1/news/headline
 * @desc    Get headline news
 * @access  Private
 */
router.get('/headline', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const result = await News.findAll({ 
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                as: 'newsCreatedBy',
                attributes: ['name']
            },{
                model: User,
                as: 'newsUpdatedBy',
                attributes: ['name']
            }], 
            limit: 5 
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
 * @route   GET /api/v1/news
 * @desc    Get all news
 * @access  Private
 */
router.get('/', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const result = await News.findAll({ 
            order: [['created_at', 'DESC']],
            include: [{
                model: User,
                as: 'newsCreatedBy',
                attributes: ['name']
            },{
                model: User,
                as: 'newsUpdatedBy',
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
 * @route   GET /api/v1/news/:slug
 * @desc    Get news detail
 * @access  Private
 */
router.get('/:slug', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const news = await News.findOne({ 
            where: { slug: req.params.slug },
            include: [{
                model: User,
                as: 'newsCreatedBy',
                attributes: ['name']
            },{
                model: User,
                as: 'newsUpdatedBy',
                attributes: ['name']
            }] 
        });

        if (!news) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'That news does not exist.'
                }]
            });
        }

        return res.status(201).json(news);
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
 * @route   POST /api/v1/news
 * @desc    Create a news
 * @access  Private
 */
router.post('/', [auth, admin, [
    check('title', 'Title is required.').not().isEmpty(),
    check('content', 'Content is required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, image } = req.body;
    
    const slug = slugify(title);
    const unix_timestamp = moment().unix();

    try {
        const news = News.build({
            author_id: req.user.id,
            title,
            slug,
            content,
            image,
            created_at: unix_timestamp
        });
        await news.save();

        return res.status(201).json(news);
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
 * @route   PUT /api/v1/news/:id
 * @desc    Update a news
 * @access  Private
 */
router.put('/:id', [auth, admin, [
    check('title', 'Title is required.').not().isEmpty(),
    check('content', 'Content is required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, image } = req.body;
    
    const slug = slugify(title);
    const unix_timestamp = moment().unix();

    try {
        let news = await News.findOne({ where: { id: req.params.id } });
        if (!news) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'The id of news that you\'ve selected does not exist.'
                }]
            });
        }

        news.updated_by = req.user.id;
        news.title = title;
        news.slug = slug;
        news.content = content;
        news.image = image;
        news.updated_at = unix_timestamp;
        news = await news.save();

        return res.status(201).json(news);
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
 * @route   DELETE /api/v1/news/:id
 * @desc    Delete a news
 * @access  Private
 */
router.delete('/:id', [auth, admin], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        await News.destroy({
            where: {
                id: req.params.id
            }
        });

        return res.status(201).json({ status: true, msg: 'Deleted news successfully.'});
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