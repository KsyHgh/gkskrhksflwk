require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Message = app.db.sequelize.define('message', {
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
        address: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        body: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });

    Message.save = async function(values) {
        const { mobileId, time, address, body, type } = values;

        const [message, created] = await this.findOrCreate({ where: { mobileId, time, address }, defaults: { mobileId, time, address, body, type } });
        if (!created) {
            await message.update({ mobileId, time, address, body, type });
        }
        return message;
    };

    Message.associate = function() {
        this.belongsTo(app.db.Mobile);
    };

    app.db.Message = Message;
};