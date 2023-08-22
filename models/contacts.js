require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Contact = app.db.sequelize.define('contact', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
        number: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
        },
    });

    Contact.associate = function() {
        this.belongsTo(app.db.Mobile);
    };

    app.db.Contact = Contact;
};