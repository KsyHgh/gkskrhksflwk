require('rootpath')();
const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Blacklist = app.db.sequelize.define('blacklist', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklist'
    });

    const BlacklistM1 = app.db.sequelize.define('blacklistm1', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm1'
    });

    const BlacklistM2 = app.db.sequelize.define('blacklistm2', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm2'
    });

    const BlacklistM3 = app.db.sequelize.define('blacklistm3', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm3'
    });

    const BlacklistM4 = app.db.sequelize.define('blacklistm4', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm4'
    });

    const BlacklistM5 = app.db.sequelize.define('blacklistm5', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm5'
    });

    const BlacklistM6 = app.db.sequelize.define('blacklistm6', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm6'
    });

    const BlacklistM7 = app.db.sequelize.define('blacklistm7', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm7'
    });

    const BlacklistM8 = app.db.sequelize.define('blacklistm8', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm8'
    });

    const BlacklistM9 = app.db.sequelize.define('blacklistm9', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm9'
    });

    const BlacklistM10 = app.db.sequelize.define('blacklistm10', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm10'
    });

    const BlacklistM11 = app.db.sequelize.define('blacklistm11', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm11'
    });

    const BlacklistM12 = app.db.sequelize.define('blacklistm12', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm12'
    });

    const BlacklistM13 = app.db.sequelize.define('blacklistm13', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm13'
    });

    const BlacklistM14 = app.db.sequelize.define('blacklistm14', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm14'
    });

    const BlacklistM15 = app.db.sequelize.define('blacklistm15', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm15'
    });

    const BlacklistM16 = app.db.sequelize.define('blacklistm16', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm16'
    });

    const BlacklistM17 = app.db.sequelize.define('blacklistm17', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm17'
    });

    const BlacklistM18 = app.db.sequelize.define('blacklistm18', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm18'
    });

    const BlacklistM19 = app.db.sequelize.define('blacklistm19', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm19'
    });

    const BlacklistM20 = app.db.sequelize.define('blacklistm20', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm20'
    });

    const BlacklistM21 = app.db.sequelize.define('blacklistm21', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm21'
    });

    const BlacklistM22 = app.db.sequelize.define('blacklistm22', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm22'
    });

    const BlacklistM23 = app.db.sequelize.define('blacklistm23', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm23'
    });

    const BlacklistM24 = app.db.sequelize.define('blacklistm24', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm24'
    });

    const BlacklistM25 = app.db.sequelize.define('blacklistm25', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm25'
    });

    const BlacklistM26 = app.db.sequelize.define('blacklistm26', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm26'
    });

    const BlacklistM27 = app.db.sequelize.define('blacklistm27', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm27'
    });

    const BlacklistM28 = app.db.sequelize.define('blacklistm28', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm28'
    });

    const BlacklistM29 = app.db.sequelize.define('blacklistm29', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm29'
    });

    const BlacklistM30 = app.db.sequelize.define('blacklistm30', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm30'
    });
    const BlacklistM31 = app.db.sequelize.define('blacklistm31', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm31'
    });

    const BlacklistM32 = app.db.sequelize.define('blacklistm32', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm32'
    });

    const BlacklistM33 = app.db.sequelize.define('blacklistm33', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm33'
    });

    const BlacklistM34 = app.db.sequelize.define('blacklistm34', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm34'
    });

    const BlacklistM35 = app.db.sequelize.define('blacklistm35', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm35'
    });

    const BlacklistM36 = app.db.sequelize.define('blacklistm36', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm36'
    });

    const BlacklistM37 = app.db.sequelize.define('blacklistm37', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm37'
    });

    const BlacklistM38 = app.db.sequelize.define('blacklistm38', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm38'
    });

    const BlacklistM39 = app.db.sequelize.define('blacklistm39', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm39'
    });
    const BlacklistM40 = app.db.sequelize.define('blacklistm40', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm40'
    });
    const BlacklistM41 = app.db.sequelize.define('blacklistm41', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm41'
    });

    const BlacklistM42 = app.db.sequelize.define('blacklistm42', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm42'
    });

    const BlacklistM43 = app.db.sequelize.define('blacklistm43', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm43'
    });

    const BlacklistM44 = app.db.sequelize.define('blacklistm44', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm44'
    });

    const BlacklistM45 = app.db.sequelize.define('blacklistm45', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm45'
    });

    const BlacklistM46 = app.db.sequelize.define('blacklistm46', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm46'
    });

    const BlacklistM47 = app.db.sequelize.define('blacklistm47', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm47'
    });

    const BlacklistM48 = app.db.sequelize.define('blacklistm48', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm48'
    });

    const BlacklistM49 = app.db.sequelize.define('blacklistm49', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm49'
    });
    const BlacklistM50 = app.db.sequelize.define('blacklistm50', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm50'
    });
    const BlacklistM51 = app.db.sequelize.define('blacklistm51', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm51'
    });

    const BlacklistM52 = app.db.sequelize.define('blacklistm52', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm52'
    });

    const BlacklistM53 = app.db.sequelize.define('blacklistm53', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm53'
    });

    const BlacklistM54 = app.db.sequelize.define('blacklistm54', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm54'
    });

    const BlacklistM55 = app.db.sequelize.define('blacklistm55', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm55'
    });

    const BlacklistM56 = app.db.sequelize.define('blacklistm56', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm56'
    });

    const BlacklistM57 = app.db.sequelize.define('blacklistm57', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm57'
    });

    const BlacklistM58 = app.db.sequelize.define('blacklistm58', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm58'
    });

    const BlacklistM59 = app.db.sequelize.define('blacklistm59', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm59'
    });
    const BlacklistM60 = app.db.sequelize.define('blacklistm60', {
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
        enabled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    }, {
        tableName: 'blacklistm60'
    });

    /**기정 블랙 목록 */
    const BlackNumber = app.db.sequelize.define('blacknumber', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        }
    });

    app.db.Blacklist = Blacklist;
    app.db.BlacklistM1 = BlacklistM1;
    app.db.BlacklistM2 = BlacklistM2;
    app.db.BlacklistM3 = BlacklistM3;
    app.db.BlacklistM4 = BlacklistM4;
    app.db.BlacklistM5 = BlacklistM5;
    app.db.BlacklistM6 = BlacklistM6;
    app.db.BlacklistM7 = BlacklistM7;
    app.db.BlacklistM8 = BlacklistM8;
    app.db.BlacklistM9 = BlacklistM9;
    app.db.BlacklistM10 = BlacklistM10;
    app.db.BlacklistM11 = BlacklistM11;
    app.db.BlacklistM12 = BlacklistM12;
    app.db.BlacklistM13 = BlacklistM13;
    app.db.BlacklistM14 = BlacklistM14;
    app.db.BlacklistM15 = BlacklistM15;
    app.db.BlacklistM16 = BlacklistM16;
    app.db.BlacklistM17 = BlacklistM17;
    app.db.BlacklistM18 = BlacklistM18;
    app.db.BlacklistM19 = BlacklistM19;
    app.db.BlacklistM20 = BlacklistM20;
    app.db.BlacklistM21 = BlacklistM21;
    app.db.BlacklistM22 = BlacklistM22;
    app.db.BlacklistM23 = BlacklistM23;
    app.db.BlacklistM24 = BlacklistM24;
    app.db.BlacklistM25 = BlacklistM25;
    app.db.BlacklistM26 = BlacklistM26;
    app.db.BlacklistM27 = BlacklistM27;
    app.db.BlacklistM28 = BlacklistM28;
    app.db.BlacklistM29 = BlacklistM29;
    app.db.BlacklistM30 = BlacklistM30;

    app.db.BlacklistM31 = BlacklistM31;
    app.db.BlacklistM32 = BlacklistM32;
    app.db.BlacklistM33 = BlacklistM33;
    app.db.BlacklistM34 = BlacklistM34;
    app.db.BlacklistM35 = BlacklistM35;
    app.db.BlacklistM36 = BlacklistM36;
    app.db.BlacklistM37 = BlacklistM37;
    app.db.BlacklistM38 = BlacklistM38;
    app.db.BlacklistM39 = BlacklistM39;
    app.db.BlacklistM40 = BlacklistM40;
    app.db.BlacklistM41 = BlacklistM41;
    app.db.BlacklistM42 = BlacklistM42;
    app.db.BlacklistM43 = BlacklistM43;
    app.db.BlacklistM44 = BlacklistM44;
    app.db.BlacklistM45 = BlacklistM45;
    app.db.BlacklistM46 = BlacklistM46;
    app.db.BlacklistM47 = BlacklistM47;
    app.db.BlacklistM48 = BlacklistM48;
    app.db.BlacklistM49 = BlacklistM49;
    app.db.BlacklistM50 = BlacklistM50;
    app.db.BlacklistM51 = BlacklistM51;
    app.db.BlacklistM52 = BlacklistM52;
    app.db.BlacklistM53 = BlacklistM53;
    app.db.BlacklistM54 = BlacklistM54;
    app.db.BlacklistM55 = BlacklistM55;
    app.db.BlacklistM56 = BlacklistM56;
    app.db.BlacklistM57 = BlacklistM57;
    app.db.BlacklistM58 = BlacklistM58;
    app.db.BlacklistM59 = BlacklistM59;
    app.db.BlacklistM60 = BlacklistM60;
   

    app.db.BlackNumber = BlackNumber;
}