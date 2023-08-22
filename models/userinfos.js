require('rootpath')();
const { Sequelize } = require('sequelize');

module.exports = app => {

    const UserInfo = app.db.sequelize.define('userinfo', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        publicAddress: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "",
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        currentLogin: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
        }

    });

    // await UserInfo.destroy({ where: { _id: { [Op.gte]: 0 } } });
    UserInfo.destroy({ truncate: true });

    app.db.UserInfo = UserInfo;
}