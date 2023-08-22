require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Avatar = app.db.sequelize.define('avatar', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        roles: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        avatar: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
    });

    app.db.Avatar = Avatar;
};