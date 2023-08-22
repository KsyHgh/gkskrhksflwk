require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Apk = app.db.sequelize.define('apk', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        package: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        version: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '',
        },
        startTime: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        lastTime: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
    });

    Apk.associate = function() {
        this.belongsTo(app.db.Mobile);
    };

    app.db.Apk = Apk;
};