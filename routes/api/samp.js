const express = require('express');
const router = express.Router();

const axios = require('axios');
var sampquery = require('samp-query');
var options = { 
    host: '139.99.96.173' 
}

/**
 * @route   GET /api/v1/server
 * @desc    Get request api.open.mp
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { data: info } = await axios.get('https://api.open.mp/server/128.199.167.43:7777'); 
        return res.status(201).json(info);
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

router.get('/new', (req, res) => {
    sampquery(options, function (error, response) {
        if (error) {
            console.error(error.message);
            return res.status(500).json({
                errors: [{
                    status: false,
                    msg: error.message
                }]
            });
        } else {
            return res.status(201).json(response);
        }
    });
});

module.exports = router;
