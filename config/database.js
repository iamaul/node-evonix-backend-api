const Sequelize = require('sequelize');

module.exports = new Sequelize(`${process.env.MYSQL_DATABASE}`, `${process.env.MYSQL_USER}`, `${process.env.MYSQL_PASSWORD}`, {
    host: `${process.env.MYSQL_HOST}`,
    dialect: 'mysql',
    define: { timestamps: false },
    operatorAliases: false,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
