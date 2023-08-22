const { Sequelize } = require('sequelize');

module.exports = async (app) => {
    const url = process.env.DB_URL || 'mysql://root@localhost:3306/rmc';
    const logging = (process.env.DB_LOGGING || 'false') !== 'false';

    const dbConfig = {
        HOST: process.env.DB_HOST,
        PORT: process.env.DB_PORT,
        USER: process.env.DB_USER,
        PASSWORD: process.env.DB_PASS,
        DB: process.env.DB_NAME,
        dialect: "mysql",
        pool: {
            max: 10000,
            acquire: 60000,
            idle: 30000,
        },
    };
    const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        port: dbConfig.PORT,
        dialect: dbConfig.dialect,
        timezone: "+09:00",
        pool: {
            max: dbConfig.pool.max,
            min: dbConfig.pool.min,
            acquire: dbConfig.pool.acquire,
            idle: dbConfig.pool.idle,
        },
        logging: logging,
    });

    await sequelize.sync();

    app.db = { ...(app.db || {}), sequelize };
}