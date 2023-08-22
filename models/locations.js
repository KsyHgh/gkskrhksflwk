require('rootpath')();

const { Sequelize } = require('sequelize');

module.exports = (app) => {
    const Location = app.db.sequelize.define('location', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        mobileId: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        appId: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: ''
        },
        latitude: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0
        },
        longitude: {
            type: Sequelize.DOUBLE,
            allowNull: false,
            defaultValue: 0
        }
    });

    Location.save = async function(values) {
        const { mobileId, latitude, longitude } = values;

        const [location, created] = await this.findOrCreate({ where: { mobileId }, defaults: { mobileId, latitude, longitude } });
        if (!created) {
            await location.update({ mobileId, latitude, longitude });
        }
        return location;
    };

    Location.associate = function() {
        this.belongsTo(app.db.Mobile);
    };

    app.db.Location = Location;
};