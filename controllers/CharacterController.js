const { check, oneOf, validationResult } = require('express-validator');
const { Op, DataTypes } = require('sequelize');

// Connection
const database = require('../config/database');

// Middleware
const auth = require('../middleware/auth');

// Models
const UserModel = require('../models/User');
const User = UserModel(database, DataTypes);

const CharacterModel = require('../models/Character');
const Character = CharacterModel(database, DataTypes);

/**
 * @route   GET /api/v1/characters
 * @desc    Get user's character
 * @access  Private
 */
exports.getUserChars = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let chars = await Character.findAll({
            where: {
                userid: req.user.userid
            },
            include: [User]
        });

        if (!chars) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'You haven\'t created any characters yet.'
                }]
            });
        }

        return res.status(201).json({ status: true, chars });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            errors: [{
                status: false,
                message: error.message
            }]
        });
    }
}

/**
 * @desc    Create a character validation
 */
exports.createCharValidation = () => {
    return [
        check('firstname', 'First Name is required.').not().isEmpty(),
        check('lastname', 'Last Name is required.').not().isEmpty(),
        check('gender')
            .exists()
            .withMessage('Gender is required.')
            .isNumeric()
            .withMessage('Only numbers are allowed.')
    ];
}

/**
 * @route   POST /api/v1/character
 * @desc    User create a character
 * @access  Private
 */
exports.createChar = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Skin
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
        297, 299, 300, 301, 302,
        303, 304, 305, 310, 311,
    ];
    
    const femaleSkins = [
        9, 10, 12, 13, 31, 
        39, 40, 41, 53, 54, 
        55, 56, 65, 69, 76, 
        77, 88, 89, 90, 91, 
        92, 93, 131, 141, 148, 
        150, 151, 157, 169, 172, 
        190, 191, 192, 193, 211,
        306, 307, 308, 309
    ];

    // Initial skin value
    let skin = 0;

    // Destructor form body
    const { 
        firstname, 
        lastname,  
        gender
    } = req.body;

    const charData = {};
    charData.userid = req.user.userid;

    if (firstname && lastname) {
        charData.name = firstname + "_" + lastname;
    }
    if (gender) {
        charData.gender = gender;
    }

    // Random skin character based on gender
    if (gender == 0) {
        skin = [Math.floor(Math.random() * maleSkins.length)];
        charData.skin_id = skin;
    } else {
        skin = [Math.floor(Math.random() * femaleSkins.length)];
        charData.skin_id = skin;
    }

    console.log(charData);

    try {
        const user_chars = Character.count({
            where: {
                userid: req.user.userid
            }
        });

        if (user_chars < 5) {
            return res.status(400).json({
                errors: [{
                    status: false,
                    message: 'You cannot create any more characters.'
                }]
            });
        }

        const character = Character.build({ charData });
        await character.save();
        return res.status(201).json({ status: true, charData });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            errors: [{
                status: false,
                message: error.message
            }]
        });
    }
}