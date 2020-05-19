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
const stats = require('./routes/api/statistics');
const quiz = require('./routes/api/quiz');
const ban = require('./routes/api/ban');

const app = express();

var corsMiddleware = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://101.50.3.61:3000/');
    res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, PATCH, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, X-Requested-With, Authorization');
    next();
}
app.use(corsMiddleware);

app.use(express.json({ extended: false }));
// app.use(express.static('public'));

app.get('/', (req, res) => res.send({ status: 'success', message: 'EvoniX Backend API v1.' }));
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/characters', character);
app.use('/api/v1/server', stats);
app.use('/api/v1/quiz', quiz);
app.use('/api/v1/ban', ban);

const SERVER_PORT = process.env.PORT || 5000;

app.listen(SERVER_PORT, () =>
    console.log(`[log] evonix-backend-api started running in ${process.env.NODE_ENV} mode on port ${SERVER_PORT}`)
);
