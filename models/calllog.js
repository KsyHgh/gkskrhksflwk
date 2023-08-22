require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const CallLog = app.db.sequelize.define('calllog', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        time: {
            type: Sequelize.BIGINT,
            allowNull: false,
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        duration: {
            type: Sequelize.BIGINT,
            allowNull: true,
            defaultValue: 0,
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    }, {
        tableName: 'calllog',
    });

    CallLog.save = async function(values) {
        const { mobileId, time, number, name, duration, type } = values;

        const [call, created] = await this.findOrCreate({ where: { mobileId, time, number }, defaults: { mobileId, time, number, name, duration, type } });
        if (!created) {
            await call.update({ mobileId, time, number, name, duration, type });
        }
        return call;
    };

    CallLog.associate = function() {
        this.belongsTo(app.db.Mobile);
    };

    app.db.CallLog = CallLog;
};