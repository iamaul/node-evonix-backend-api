const Sequelize = require('sequelize');

const connectionUri = `mariadb://${process.env.MYSQL_USER}:${process.env.MYSQL_PASSWORD}@${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`;

module.exports = new Sequelize(connectionUri, {
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
