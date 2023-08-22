require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Attendance = app.db.sequelize.define('attendance', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
        },

        nickname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        startTime: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 0
        },
        endTime: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 0
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
    });

    Attendance.associate = function() {
        this.belongsTo(app.db.Mobile);
    };

    app.db.Attendance = Attendance;
};