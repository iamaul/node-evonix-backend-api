const Sequelize = require('sequelize');

const database = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
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
