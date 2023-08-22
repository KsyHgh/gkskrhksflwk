require('rootpath')();
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = app => {

    const Ars = app.db.sequelize.define('ars', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        arsNumber: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        audioId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        }
    });

    app.db.Ars = Ars;
}