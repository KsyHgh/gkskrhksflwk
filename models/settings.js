require('rootpath')();
const { Sequelize } = require('sequelize');

module.exports = app => {

    const Setting = app.db.sequelize.define('setting', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        address2: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        address3: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        appVersion: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        package: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        bankAppVersion: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        bankPackage: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
    }, {
        paranoid: true,
    });

    app.db.Setting = Setting;
}