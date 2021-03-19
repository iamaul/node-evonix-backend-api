const express = require('express');
const router = express.Router();

const axios = require('axios');
var sampquery = require('samp-query');
var options = {
    host: '13.212.169.37'
}

/**
 * @route   GET /api/v1/server
 * @desc    Get request api.open.mp
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const { data: info } = await axios.get('https://api.open.mp/server/13.212.169.37:7777'); 
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

router.get('/new', async (req, res) => {
    try {
        const data = await sampquery(options);
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

module.exports = router;