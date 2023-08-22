require('rootpath')();
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = app => {

    const User = app.db.sequelize.define('user', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false
        },
        loginid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            set(val) {
                this.setDataValue('password', bcrypt.hashSync(val, 10));
            }
        },
        passwordStr: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '',
        },
        numberReal: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        roles: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
            get() {
                return this.getDataValue('roles').split(',');
            }
        },
        authcode: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '',
        },
        expiredDay: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        address: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    }, {
        paranoid: true,
    });

    User.associate = function () {
        this.hasMany(app.db.Mobile, { sourceKey: 'appId', foreignKey: 'appId' });
    };

    User.authenticate = async function ({ loginid, password }) {
        const user = await this.findOne({ where: { loginid } });
        if (user) {
            if (bcrypt.compareSync(password, user.password))
                return { ...user.dataValues, password: undefined };
        }
    };

    User.save = async function ({ username, loginid, password, roles, appId, numberReal }) {
        if (!numberReal)
            numberReal = '';
        const userValues = { username, loginid, password, passwordStr: password, roles, appId, numberReal };
        let user = await this.findOne({ where: { loginid } });
        if (user == null) {
            user = await this.create(userValues);
        } else {
            await this.update({ username, loginid, password, passwordStr: password, roles, appId }, { where: { loginid } });
        }
        return user;
    };

    User.migrate = async () => {
        const count = await User.count();
        if (count == 0) {
            await User.destroy({ truncate: true });
            console.log('add default users');
            await User.save({
                username: 'superadmin',
                loginid: 'superadmin',
                password: 'superadmin123!@#',
                appId: 'super',
                roles: 'chongpan',
                numberReal: '123456'
            });

            await User.save({
                username: process.env.ADMIN_USERNAME || 'admin',
                loginid: process.env.ADMIN_LOGINID || 'admin',
                password: process.env.ADMIN_PASSWORD || 'wjfeoqlalf123#$%',
                appId: process.env.ADMIN_APP_ID || 'chongpan',
                roles: process.env.ADMIN_ROLE || 'chongpan',
                numberReal: '123456'
            });

            await User.save({
                username: process.env.MAEZHANG_USERNAME || '매장1',
                loginid: process.env.MAEZHANG_LOGINID || 'maezhang1',
                password: process.env.MAEZHANG_PASSWORD || '123',
                appId: process.env.MAEZHANG_APP_ID || 'maezhang1',
                roles: process.env.MAEZHANG_ROLE || 'maezhang',
                numberReal: '234567'
            });
        }
    };

    app.db.User = User;
}