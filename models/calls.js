require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {

    const Call = app.db.sequelize.define('call', {
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
            defaultValue: ''
        },
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        type: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        callState: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        direction: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        contactName: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        time: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0,
        },
        endTime: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0,
        }
    });

    Call.DIRECTION_INCOMING = 0;
    Call.DIRECTION_OUTGOING = 1;

    Call.TYPE_BLOCK = 0;
    Call.TYPE_CALL = 1;

    Call.CALL_STATE_START = 0;
    Call.CALL_STATE_OFFHOOK = 1;
    Call.CALL_STATE_END = 2;

    Call.associate = function() {
        this.belongsTo(app.db.Mobile);
    };

    app.db.Call = Call;
};