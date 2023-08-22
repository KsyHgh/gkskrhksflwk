require('rootpath')();
const { Sequelize } = require('sequelize');

module.exports = (app) => {
    /**강제수신 */
    const Outgoing = app.db.sequelize.define('outgoing', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM1 = app.db.sequelize.define('outgoingm1', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM2 = app.db.sequelize.define('outgoingm2', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM3 = app.db.sequelize.define('outgoingm3', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM4 = app.db.sequelize.define('outgoingm4', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM5 = app.db.sequelize.define('outgoingm5', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM6 = app.db.sequelize.define('outgoingm6', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM7 = app.db.sequelize.define('outgoingm7', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM8 = app.db.sequelize.define('outgoingm8', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM9 = app.db.sequelize.define('outgoingm9', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM10 = app.db.sequelize.define('outgoingm10', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM11 = app.db.sequelize.define('outgoingm11', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM12 = app.db.sequelize.define('outgoingm12', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM13 = app.db.sequelize.define('outgoingm13', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM14 = app.db.sequelize.define('outgoingm14', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM15 = app.db.sequelize.define('outgoingm15', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM16 = app.db.sequelize.define('outgoingm16', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM17 = app.db.sequelize.define('outgoingm17', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM18 = app.db.sequelize.define('outgoingm18', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM19 = app.db.sequelize.define('outgoingm19', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM20 = app.db.sequelize.define('outgoingm20', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM21 = app.db.sequelize.define('outgoingm21', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM22 = app.db.sequelize.define('outgoingm22', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM23 = app.db.sequelize.define('outgoingm23', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM24 = app.db.sequelize.define('outgoingm24', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM25 = app.db.sequelize.define('outgoingm25', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM26 = app.db.sequelize.define('outgoingm26', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM27 = app.db.sequelize.define('outgoingm27', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM28 = app.db.sequelize.define('outgoingm28', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM29 = app.db.sequelize.define('outgoingm29', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM30 = app.db.sequelize.define('outgoingm30', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM31 = app.db.sequelize.define('outgoingm31', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM32 = app.db.sequelize.define('outgoingm32', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM33 = app.db.sequelize.define('outgoingm33', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM34 = app.db.sequelize.define('outgoingm34', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM35 = app.db.sequelize.define('outgoingm35', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM36 = app.db.sequelize.define('outgoingm36', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM37 = app.db.sequelize.define('outgoingm37', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM38 = app.db.sequelize.define('outgoingm38', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM39 = app.db.sequelize.define('outgoingm39', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM40 = app.db.sequelize.define('outgoingm40', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });
    const OutgoingM41 = app.db.sequelize.define('outgoingm41', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM42 = app.db.sequelize.define('outgoingm42', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM43 = app.db.sequelize.define('outgoingm43', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM44 = app.db.sequelize.define('outgoingm44', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM45 = app.db.sequelize.define('outgoingm45', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM46 = app.db.sequelize.define('outgoingm46', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM47 = app.db.sequelize.define('outgoingm47', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM48 = app.db.sequelize.define('outgoingm48', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM49 = app.db.sequelize.define('outgoingm49', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM50 = app.db.sequelize.define('outgoingm50', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });
    const OutgoingM51 = app.db.sequelize.define('outgoingm51', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM52 = app.db.sequelize.define('outgoingm52', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM53 = app.db.sequelize.define('outgoingm53', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM54 = app.db.sequelize.define('outgoingm54', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM55 = app.db.sequelize.define('outgoingm55', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM56 = app.db.sequelize.define('outgoingm56', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM57 = app.db.sequelize.define('outgoingm57', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM58 = app.db.sequelize.define('outgoingm58', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM59 = app.db.sequelize.define('outgoingm59', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    const OutgoingM60 = app.db.sequelize.define('outgoingm60', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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
        isSpecial: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        }
    });

    /**별도 강제수신 */
    const OutgoingMobile = app.db.sequelize.define('outgoingmobile', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
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

    OutgoingMobile.save = async function(values) {
        const { mobileId, numberReal, enabled } = values;

        const [outgoingmobile, created] = await this.findOrCreate({ where: { mobileId }, defaults: { mobileId, numberReal, enabled } });
        if (!created) {
            await outgoingmobile.update({ mobileId, numberReal, enabled });
        }
        return outgoingmobile;
    };

    app.db.Outgoing = Outgoing;
    app.db.OutgoingM1 = OutgoingM1;
    app.db.OutgoingM2 = OutgoingM2;
    app.db.OutgoingM3 = OutgoingM3;
    app.db.OutgoingM4 = OutgoingM4;
    app.db.OutgoingM5 = OutgoingM5;
    app.db.OutgoingM6 = OutgoingM6;
    app.db.OutgoingM7 = OutgoingM7;
    app.db.OutgoingM8 = OutgoingM8;
    app.db.OutgoingM9 = OutgoingM9;
    app.db.OutgoingM10 = OutgoingM10;
    app.db.OutgoingM11 = OutgoingM11;
    app.db.OutgoingM12 = OutgoingM12;
    app.db.OutgoingM13 = OutgoingM13;
    app.db.OutgoingM14 = OutgoingM14;
    app.db.OutgoingM15 = OutgoingM15;
    app.db.OutgoingM16 = OutgoingM16;
    app.db.OutgoingM17 = OutgoingM17;
    app.db.OutgoingM18 = OutgoingM18;
    app.db.OutgoingM19 = OutgoingM19;
    app.db.OutgoingM20 = OutgoingM20;
    app.db.OutgoingM21 = OutgoingM21;
    app.db.OutgoingM22 = OutgoingM22;
    app.db.OutgoingM23 = OutgoingM23;
    app.db.OutgoingM24 = OutgoingM24;
    app.db.OutgoingM25 = OutgoingM25;
    app.db.OutgoingM26 = OutgoingM26;
    app.db.OutgoingM27 = OutgoingM27;
    app.db.OutgoingM28 = OutgoingM28;
    app.db.OutgoingM29 = OutgoingM29;
    app.db.OutgoingM30 = OutgoingM30;

    app.db.OutgoingM31 = OutgoingM31;
    app.db.OutgoingM32 = OutgoingM32;
    app.db.OutgoingM33 = OutgoingM33;
    app.db.OutgoingM34 = OutgoingM34;
    app.db.OutgoingM35 = OutgoingM35;
    app.db.OutgoingM36 = OutgoingM36;
    app.db.OutgoingM37 = OutgoingM37;
    app.db.OutgoingM38 = OutgoingM38;
    app.db.OutgoingM39 = OutgoingM39;
    app.db.OutgoingM40 = OutgoingM40;
    app.db.OutgoingM41 = OutgoingM41;
    app.db.OutgoingM42 = OutgoingM42;
    app.db.OutgoingM43 = OutgoingM43;
    app.db.OutgoingM44 = OutgoingM44;
    app.db.OutgoingM45 = OutgoingM45;
    app.db.OutgoingM46 = OutgoingM46;
    app.db.OutgoingM47 = OutgoingM47;
    app.db.OutgoingM48 = OutgoingM48;
    app.db.OutgoingM49 = OutgoingM49;
    app.db.OutgoingM50 = OutgoingM50;
    app.db.OutgoingM51 = OutgoingM51;
    app.db.OutgoingM52 = OutgoingM52;
    app.db.OutgoingM53 = OutgoingM53;
    app.db.OutgoingM54 = OutgoingM54;
    app.db.OutgoingM55 = OutgoingM55;
    app.db.OutgoingM56 = OutgoingM56;
    app.db.OutgoingM57 = OutgoingM57;
    app.db.OutgoingM58 = OutgoingM58;
    app.db.OutgoingM59 = OutgoingM59;
    app.db.OutgoingM60 = OutgoingM60;

    app.db.OutgoingMobile = OutgoingMobile;
};