const express = require('express');
const router = express.Router();

const moment = require('moment');
const { check, validationResult } = require('express-validator');

// Middleware
const auth = require('../../middleware/auth');

// Models
const Character = require('../../models/Character');
const AdminWarn = require('../../models/AdminWarn');
const Inventory = require('../../models/Inventory');
const Vehicle = require('../../models/Vehicle');
const Property = require('../../models/Property');
const Faction = require('../../models/Faction');

/**
 * @route   GET /api/v1/characters
 * @desc    Get user's character
 * @access  Private
 */
router.get('/', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { count, rows } = await Character.findAndCountAll({
            where: {
                userid: req.user.id
            },
            include: [{
                model: Faction,
                as: 'charFaction',
                attributes: ['id', 'name', 'alias']
            }]
        });

        if (count < 0) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'No characters are listed for this user.'
                }]
            });
        }

        const data = { count, rows };

        return res.status(201).json(data);
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
 * @route   GET /api/v1/characters/:id
 * @desc    Get character details
 * @access  Private
 */
router.get('/:id', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const char = await Character.findOne({
            where: {
                id: req.params.id
            },
            include: [{
                model: Faction,
                as: 'charFaction'
            }]
        });

        if (!char) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'Characters not found.'
                }]
            });
        }

        return res.status(201).json(char);
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
 * @route   GET /api/v1/characters/faction/:faction_sqlid
 * @desc    Get faction members
 * @access  Private
 */
router.get('/faction/:faction_sqlid', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const char = await Character.findAll({
            where: {
                faction_sqlid: req.params.faction_sqlid
            },
            include: [{
                model: Faction,
                as: 'charFaction'
            }]
        });

        if (!char) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'Faction members not found.'
                }]
            });
        }

        return res.status(201).json(char);
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
 * @route   POST /api/v1/characters/new
 * @desc    Create a character
 * @access  Private
 */
router.post('/new', [auth, [
    check('firstname', 'First name is required.')
        .not()
        .isEmpty()
        .isLength({ min: 2 })
        .withMessage('First name must be at least 2 minimum characters.')
        .matches(/^[a-zA-Z]+$/, 'i')
        .withMessage('Only these characters are allowed (a-z, A-Z).'),
    check('lastname', 'Last name is required.')
        .not()
        .isEmpty()
        .isLength({ min: 2 })
        .withMessage('Last name must be at least 2 minimum characters.')
        .matches(/^[a-zA-Z]+$/, 'i')
        .withMessage('Only these characters are allowed (a-z, A-Z).'),
    check('gender', 'Gender is required.').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const maleSkins = [
        1, 2, 3, 4, 5, 
        6, 7, 8, 14, 15, 
        16, 17, 18, 19, 20, 
        21, 22, 23, 24, 25,
        26, 27, 28, 29, 30, 
        32, 33, 34, 35, 36, 
        37, 42, 43, 44, 45, 
        46, 47, 48, 49, 50,
        51, 52, 57, 58, 59, 
        60, 61, 62, 66, 67, 
        68, 70, 71, 72, 73, 
        78, 79, 80, 81, 82,
        83, 84, 86, 94, 95, 
        96, 97, 98, 99, 100, 
        101, 102, 103, 104, 105, 
        106, 107, 108, 109, 110, 
        111, 112, 113, 114, 115, 
        116, 117, 118, 119, 120, 
        121, 122, 123, 124, 125, 
        126, 127, 128, 132, 133, 
        134, 135, 136, 137, 142, 
        143, 144, 146, 147, 149, 
        153, 154, 155, 156, 158, 
        160, 161, 162, 163, 164, 
        165, 166, 167, 168, 170, 
        171, 173, 174, 175, 176, 
        177, 178, 180, 181, 182, 
        183, 184, 185, 186, 187, 
        188, 189, 200, 202, 203, 
        204, 206, 208, 209, 210, 
        212, 213, 217, 220, 221, 
        222, 223, 227, 228, 229,
        230, 234, 235, 236, 239, 
        240, 241, 242, 247, 248, 
        249, 250, 252, 253, 254, 
        255, 258, 259, 260, 261, 
        262, 264, 268, 269, 270, 
        271, 272, 273, 289, 291, 
        292, 293, 294, 295, 296, 
        297, 299
    ];
    
    const femaleSkins = [
        9, 10, 12, 13, 31, 
        39, 40, 41, 53, 54, 
        55, 56, 65, 69, 76, 
        77, 88, 89, 90, 91, 
        92, 93, 131, 141, 148, 
        150, 151, 157, 169, 172, 
        190, 191, 192, 193, 211
    ];

    let skin = 0;

    const { 
        firstname, 
        lastname,  
        gender
    } = req.body;

    const charData = {};
    charData.userid = req.user.id;

    if (firstname && lastname) {
        charData.name = firstname + "_" + lastname;
    }
    charData.gender = gender;

    if (gender === 0) {
        skin = maleSkins[Math.floor(Math.random() * maleSkins.length)];
        charData.skin_id = skin;
    } else {
        skin = femaleSkins[Math.floor(Math.random() * femaleSkins.length)];
        charData.skin_id = skin;
    }

    try {
        const charname = await Character.findOne({ 
            where: { name: charData.name }
        });

        if (charname) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'You can\'t use that character name as it\'s already in use.'
                }]
            });
        }

        const user_chars = await Character.count({
            where: {
                userid: req.user.id
            }
        });

        if (user_chars === 5) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'You cannot create any more characters.'
                }]
            });
        }

        const character = Character.build(charData);
        await character.save();

        const { count, rows } = await Character.findAndCountAll({
            where: {
                userid: req.user.id
            }
        });
        const data = { count, rows };
        return res.status(201).json(data);
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
 * @route   DELETE /api/v1/characters/:id
 * @desc    Delete a character
 * @access  Private
 */
router.delete('/:id', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const unix_timestamp = moment().unix() + (24*60*60); // current timestamp + add 24 hours

    try {
        const user = await User.findOne({
            where: { id: req.user.id },
            attributes: ['delay_character_deletion']
        });

        if (moment().unix() < user.delay_character_deletion) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    msg: 'You still have 24 hours time delay for character deletion.'
                }]
            });
        }

        // Update user character_delete timestamp
        await User.update({
            delay_character_deletion: unix_timestamp
        }, { where: { id: req.user.id } });

        await Character.destroy({
            where: {
                id: req.params.id
            }
        });

        return res.status(201).json({ status: true, msg: 'Deleted character successfully.'});
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
 * @route   GET /api/v1/characters/:char_id/admin_warn
 * @desc    Get character's admin warns
 * @access  Private
 */
router.get('/:char_id/admin_warn', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const adminwarn = await AdminWarn.findAll({ 
            where: { char_id: req.params.char_id },
            order: [['timestamp', 'DESC']]
        });

        return res.status(201).json(adminwarn);
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
 * @route   GET /api/v1/characters/:char_id/inventory
 * @desc    Get character's inventory
 * @access  Private
 */
router.get('/:char_id/inventory', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const inventory = await Inventory.findAll({ 
            where: { char_id: req.params.char_id },
            order: [['amount', 'DESC']]
        });

        return res.status(201).json(inventory);
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
 * @route   GET /api/v1/characters/:owner_sqlid/vehicle
 * @desc    Get character's vehicle
 * @access  Private
 */
router.get('/:owner_sqlid/vehicle', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const veh = await Vehicle.findAll({ 
            where: { owner_sqlid: req.params.owner_sqlid },
            order: [['mileage', 'DESC']]
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

/**
 * @route   GET /api/v1/characters/:owner_sqlid/property
 * @desc    Get character's property
 * @access  Private
 */
router.get('/:owner_sqlid/property', auth, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const veh = await Property.findAll({ 
            where: { owner_sqlid: req.params.owner_sqlid },
            order: [['price', 'DESC']]
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