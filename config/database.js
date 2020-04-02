const Sequelize = require('sequelize');

const database = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mariadb',
    dialectOptions: { timezone: 'Etc/GMT+7' },
    define: { timestamps: false },
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000            
    }
});

module.exports = database;

/**
 * Old version
 */
// const databaseConnection = async () => {
//     try {
//         const connection = new Sequelize(process.env.DATABASE_URI, {
//             dialect: 'mariadb',
//             dialectOptions: { timezone: 'Etc/GMT+7' },
//             define: { timestamps: false },
//             operatorAliases: false,
//             pool: {
//                 max: 5,
//                 min: 0,
//                 acquire: 30000,
//                 idle: 10000            
//             }
//         });
//         await connection.authenticate();
//         console.log('[log] Database connection has been established successfully.');
//     } catch (error) {
//         console.error('[log] Unable to connect to the database: ' + error);
//         // Kill process failure to connect to database
//         process.exit(1);
//     }
// }

// module.exports = databaseConnection;
