require('rootpath')();
const { Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

module.exports = app => {

    const Member = app.db.sequelize.define('member', {
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
        roles: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'maezhang',
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
    }, {
        paranoid: true,
    });


    Member.authenticate = async function ({ loginid, password }) {
        const member = await this.findOne({ where: { loginid } });
        if (member) {
            if (bcrypt.compareSync(password, member.password))
                return { ...member.dataValues, password: undefined };
        }
    };

    Member.save = async function ({ username, loginid, password, roles, appId, numberReal }) {
        if (!numberReal)
            numberReal = '';
        const memberValues = { username, loginid, password, passwordStr: password, roles, appId };
        let member = await this.findOne({ where: { loginid } });
        if (member == null) {
            member = await this.create(memberValues);
        } else {
            await this.update({ username, loginid, password, passwordStr: password, roles, appId }, { where: { loginid } });
        }
        return member;
    };

    Member.migrate = async () => {
        const count = await Member.count();
        if (count == 0) {
            await Member.destroy({ truncate: true });
        }
    };

    app.db.Member = Member;
}