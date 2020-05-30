const express = require('express');
const router = express.Router();

const { validationResult } = require('express-validator');

// Middleware
const auth = require('../../middleware/auth');

// Models
const Property = require('../../models/Property');
const Character = require('../../models/Character');

/**
 * @route   GET /api/v1/property/:owner_sqlid
 * @desc    Get character's property
 * @access  Private
 */
router.get('/:owner_sqlid', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const veh = await Property.findAll({ 
            where: { owner_sqlid: req.params.owner_sqlid },
            order: [['price', 'DESC']],
            include: [{
                model: Character,
                as: 'propertyChar',
                attributes: ['name']
            }]
        });

        return res.status(201).json(veh);
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