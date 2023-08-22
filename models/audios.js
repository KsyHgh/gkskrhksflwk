require('rootpath')();
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = app => {

    const Audio = app.db.sequelize.define('audio', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fileName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        bankType: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        }
    });

    app.db.Audio = Audio;
}