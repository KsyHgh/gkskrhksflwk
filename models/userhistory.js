require('rootpath')();
const { Sequelize } = require('sequelize');

module.exports = app => {

    const UserHistory = app.db.sequelize.define('userhistory', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        clientIp: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
        },
        userName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
        },
        userId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
        },
        userRole: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
        },
        isLogin:{
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        loginAt:{
            type: Sequelize.STRING,
            allowNull: true,
            // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        logoutAt:{
            type: Sequelize.STRING,
            allowNull: true,
            // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }

    },{
        tableName: "userhistory",
    });

    app.db.UserHistory = UserHistory;
}