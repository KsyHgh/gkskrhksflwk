require('rootpath')();
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = app => {

    const AppId = app.db.sequelize.define('appid', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        role: {
            type: Sequelize.STRING,
            allowNull: false
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        frontAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        bankType: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '',
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        apkName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        appVersion: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        }
    }, {
        paranoid: true,
    });

    app.db.AppId = AppId;
}