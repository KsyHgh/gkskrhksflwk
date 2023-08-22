require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Log = app.db.sequelize.define('log', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        content: {
            type: Sequelize.STRING,
            allowNull: false
        },
    });

    Log.associate = function() {
        this.belongsTo(app.db.Mobile);
    };

    app.db.Log = Log;
};