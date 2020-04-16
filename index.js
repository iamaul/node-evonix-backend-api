const express = require('express');
const cors = require('cors');

const whitelist = ['http://103.129.222.3:3000', 'http://ucp.evonix-rp.com']
const message = { status: 'false', message: 'evonix-backend-api v1.' };
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            callback(`{ status: ${message.status}, message: ${message.message} }`)
        }
    }
}

require('dotenv').config()

const database = require('./config/database');

// Database Connection
database
    .authenticate()
    .then(() => {
        console.log('[log] Database connection has been established successfully.');
    })
    .catch(error => {
        console.error('[log] Unable to connect to the database: ' + error);
        // Kill process failure to connect to database
        process.exit(1);
    });

// Routes
const auth = require('./routes/auth');
const user = require('./routes/user');
const character = require('./routes/character');

const app = express();

app.use(cors(corsOptions));

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send({ status: 'success', message: 'EvoniX Backend API v1.' }));
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/characters', character);

const SERVER_PORT = process.env.PORT || 5000;

app.listen(SERVER_PORT, () =>
    console.log(`[log] evonix-backend-api started running in ${process.env.NODE_ENV} mode on port ${SERVER_PORT}`)
);
