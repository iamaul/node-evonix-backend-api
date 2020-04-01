const express = require('express');
const dotenv = require('dotenv');
dotenv.config({ path: './config/config.env' });

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

const app = express();

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send({ status: 'success', message: 'EvoniX Roleplay UCP - API v1.' }));
app.use('/api/v1/auth', auth);
app.use('/api/v1/user', user);

const SERVER_PORT = process.env.PORT || 3000;

app.listen(SERVER_PORT, () =>
    console.log(`[log] backend-api-server started running in ${process.env.NODE_ENV} mode on port ${SERVER_PORT}`)
);