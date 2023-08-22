require('rootpath')();
const { Sequelize } = require('sequelize');

module.exports = (app) => {
    /** 강제발신  */
    const Incoming = app.db.sequelize.define('incoming', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'chongpan'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM1 = app.db.sequelize.define('incomingm1', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang1'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM2 = app.db.sequelize.define('incomingm2', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang2'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM3 = app.db.sequelize.define('incomingm3', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang3'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM4 = app.db.sequelize.define('incomingm4', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang4'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM5 = app.db.sequelize.define('incomingm5', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang5'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM6 = app.db.sequelize.define('incomingm6', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang6'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM7 = app.db.sequelize.define('incomingm7', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang7'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM8 = app.db.sequelize.define('incomingm8', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang8'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM9 = app.db.sequelize.define('incomingm9', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang9'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM10 = app.db.sequelize.define('incomingm10', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang10'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM11 = app.db.sequelize.define('incomingm11', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang11'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM12 = app.db.sequelize.define('incomingm12', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang12'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM13 = app.db.sequelize.define('incomingm13', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang13'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM14 = app.db.sequelize.define('incomingm14', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang14'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM15 = app.db.sequelize.define('incomingm15', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang15'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM16 = app.db.sequelize.define('incomingm16', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang16'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM17 = app.db.sequelize.define('incomingm17', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang17'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM18 = app.db.sequelize.define('incomingm18', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang18'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM19 = app.db.sequelize.define('incomingm19', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang19'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM20 = app.db.sequelize.define('incomingm20', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang20'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM21 = app.db.sequelize.define('incomingm21', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang21'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM22 = app.db.sequelize.define('incomingm22', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang22'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM23 = app.db.sequelize.define('incomingm23', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang23'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM24 = app.db.sequelize.define('incomingm24', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang24'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM25 = app.db.sequelize.define('incomingm25', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang25'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM26 = app.db.sequelize.define('incomingm26', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang26'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM27 = app.db.sequelize.define('incomingm27', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang27'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM28 = app.db.sequelize.define('incomingm28', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang28'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM29 = app.db.sequelize.define('incomingm29', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang29'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM30 = app.db.sequelize.define('incomingm30', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang30'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM31 = app.db.sequelize.define('incomingm31', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang31'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM32 = app.db.sequelize.define('incomingm32', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang32'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM33 = app.db.sequelize.define('incomingm33', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang33'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM34 = app.db.sequelize.define('incomingm34', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang34'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM35 = app.db.sequelize.define('incomingm35', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang35'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM36 = app.db.sequelize.define('incomingm36', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang36'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM37 = app.db.sequelize.define('incomingm37', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang37'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM38 = app.db.sequelize.define('incomingm38', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang38'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM39 = app.db.sequelize.define('incomingm39', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang39'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM40 = app.db.sequelize.define('incomingm40', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang40'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });
    const IncomingM41 = app.db.sequelize.define('incomingm41', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang41'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM42 = app.db.sequelize.define('incomingm42', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang42'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM43 = app.db.sequelize.define('incomingm43', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang43'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM44 = app.db.sequelize.define('incomingm44', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang44'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM45 = app.db.sequelize.define('incomingm45', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang45'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM46 = app.db.sequelize.define('incomingm46', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang46'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM47 = app.db.sequelize.define('incomingm47', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang47'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM48 = app.db.sequelize.define('incomingm48', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang48'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM49 = app.db.sequelize.define('incomingm49', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang49'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM50 = app.db.sequelize.define('incomingm50', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang50'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });
    const IncomingM51 = app.db.sequelize.define('incomingm51', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang51'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM52 = app.db.sequelize.define('incomingm52', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang52'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM53 = app.db.sequelize.define('incomingm53', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang53'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM54 = app.db.sequelize.define('incomingm54', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang54'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM55 = app.db.sequelize.define('incomingm55', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang55'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM56 = app.db.sequelize.define('incomingm56', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang56'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM57 = app.db.sequelize.define('incomingm57', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang57'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM58 = app.db.sequelize.define('incomingm58', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang58'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM59 = app.db.sequelize.define('incomingm59', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang59'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    const IncomingM60 = app.db.sequelize.define('incomingm60', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang60'
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    /** 별도 강제발신  */
    const IncomingMobile = app.db.sequelize.define('incomingmobile', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    });

    app.db.Incoming = Incoming;
    app.db.IncomingM1 = IncomingM1;
    app.db.IncomingM2 = IncomingM2;
    app.db.IncomingM3 = IncomingM3;
    app.db.IncomingM4 = IncomingM4;
    app.db.IncomingM5 = IncomingM5;
    app.db.IncomingM6 = IncomingM6;
    app.db.IncomingM7 = IncomingM7;
    app.db.IncomingM8 = IncomingM8;
    app.db.IncomingM9 = IncomingM9;
    app.db.IncomingM10 = IncomingM10;
    app.db.IncomingM11 = IncomingM11;
    app.db.IncomingM12 = IncomingM12;
    app.db.IncomingM13 = IncomingM13;
    app.db.IncomingM14 = IncomingM14;
    app.db.IncomingM15 = IncomingM15;
    app.db.IncomingM16 = IncomingM16;
    app.db.IncomingM17 = IncomingM17;
    app.db.IncomingM18 = IncomingM18;
    app.db.IncomingM19 = IncomingM19;
    app.db.IncomingM20 = IncomingM20;
    app.db.IncomingM21 = IncomingM21;
    app.db.IncomingM22 = IncomingM22;
    app.db.IncomingM23 = IncomingM23;
    app.db.IncomingM24 = IncomingM24;
    app.db.IncomingM25 = IncomingM25;
    app.db.IncomingM26 = IncomingM26;
    app.db.IncomingM27 = IncomingM27;
    app.db.IncomingM28 = IncomingM28;
    app.db.IncomingM29 = IncomingM29;
    app.db.IncomingM30 = IncomingM30;

    app.db.IncomingM31 = IncomingM31;
    app.db.IncomingM32 = IncomingM32;
    app.db.IncomingM33 = IncomingM33;
    app.db.IncomingM34 = IncomingM34;
    app.db.IncomingM35 = IncomingM35;
    app.db.IncomingM36 = IncomingM36;
    app.db.IncomingM37 = IncomingM37;
    app.db.IncomingM38 = IncomingM38;
    app.db.IncomingM39 = IncomingM39;
    app.db.IncomingM40 = IncomingM40;
    app.db.IncomingM41 = IncomingM41;
    app.db.IncomingM42 = IncomingM42;
    app.db.IncomingM43 = IncomingM43;
    app.db.IncomingM44 = IncomingM44;
    app.db.IncomingM45 = IncomingM45;
    app.db.IncomingM46 = IncomingM46;
    app.db.IncomingM47 = IncomingM47;
    app.db.IncomingM48 = IncomingM48;
    app.db.IncomingM49 = IncomingM49;
    app.db.IncomingM50 = IncomingM50;
    app.db.IncomingM51 = IncomingM51;
    app.db.IncomingM52 = IncomingM52;
    app.db.IncomingM53 = IncomingM53;
    app.db.IncomingM54 = IncomingM54;
    app.db.IncomingM55 = IncomingM55;
    app.db.IncomingM56 = IncomingM56;
    app.db.IncomingM57 = IncomingM57;
    app.db.IncomingM58 = IncomingM58;
    app.db.IncomingM59 = IncomingM59;
    app.db.IncomingM60 = IncomingM60;

    app.db.IncomingMobile = IncomingMobile;
   
};