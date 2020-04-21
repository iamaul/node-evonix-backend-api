const express = require('express');

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
const auth = require('./routes/api/auth');
const user = require('./routes/api/user');
const character = require('./routes/api/character');

const app = express();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send({ status: 'success', message: 'EvoniX Backend API v1.' }));
app.use('/v1/auth', auth);
app.use('/v1/users', user);
app.use('/v1/characters', character);

const SERVER_PORT = process.env.PORT || 5000;

app.listen(SERVER_PORT, () =>
    console.log(`[log] evonix-backend-api started running in ${process.env.NODE_ENV} mode on port ${SERVER_PORT}`)
);
