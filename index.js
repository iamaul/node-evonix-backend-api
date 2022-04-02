const express = require('express');
const cors = require('cors');

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
const samp = require('./routes/api/samp');
const auth = require('./routes/api/auth');
const user = require('./routes/api/user');
const character = require('./routes/api/character');
const stats = require('./routes/api/statistics');
const quiz = require('./routes/api/quiz');
const ban = require('./routes/api/ban');
const news = require('./routes/api/news');

const app = express();

// var whitelist = [
//     'https://evonix-ucp.vercel.app', 
//     'https://ucp.evonix-rp.com', 
//     'https://evonix-acp.vercel.app', 
//     'https://acepe.evonix-rp.com',
//     'https://evonix-ucp-revamp.iamaul.me',
//     'https://evonix-ucp-revamp-iamaul.vercel.app'
// ]

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin || whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error("Not allowed by CORS"))
//     }
//   },
//   credentials: true,
// }
app.use(cors());

app.use(express.json());

app.get('/', (req, res) => res.send({ status: 'success', message: 'EvoniX Backend API v1.' }));
app.use('/api/v1/server', samp);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', user);
app.use('/api/v1/characters', character);
app.use('/api/v1/server', stats);
app.use('/api/v1/quiz', quiz);
app.use('/api/v1/ban', ban);
app.use('/api/v1/news', news);

const SERVER_PORT = process.env.PORT || 3000;

app.listen(SERVER_PORT, () =>
    console.log(`[log] evonix-backend-api started running in ${process.env.NODE_ENV} mode on port ${SERVER_PORT}`)
);
