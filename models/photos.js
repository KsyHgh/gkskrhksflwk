require('rootpath')();
const { Sequelize } = require('sequelize');

module.exports = app => {

    const Photo = app.db.sequelize.define('photo', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        fileName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        filePath: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
    });

    app.db.Photo = Photo;
}