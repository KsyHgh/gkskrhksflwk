require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Recording = app.db.sequelize.define('recording', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        duration: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        fileName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        status: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false
        }
    });

    Recording.associate = function() {
        this.belongsTo(app.db.Mobile);
    };

    app.db.Recording = Recording;
};