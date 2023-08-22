const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const ActionLog = app.db.sequelize.define('actionlog', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });

    app.db.ActionLog = ActionLog;
}