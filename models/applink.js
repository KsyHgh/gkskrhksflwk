require('rootpath')();
const { Sequelize } = require('sequelize');

module.exports = app => {
    const AppLink = app.db.sequelize.define('applink', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        autoLink: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        handLink: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        version: {
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
        type: {
            /** type: 1 => 메인앱, type: 2 => 콜앱, type: 0 => 2단계후후앱 **/
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
    }, {
        paranoid: true,
    });

    app.db.AppLink = AppLink;
}