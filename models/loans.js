require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Loan = app.db.sequelize.define('loan', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ''
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: ""
        },
        idCard: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        nickname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        social: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        company: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        income: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        amount: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
    });

    Loan.associate = function () {
        this.belongsTo(app.db.Mobile);
    };

    app.db.Loan = Loan;
};