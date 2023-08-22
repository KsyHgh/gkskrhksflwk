require('rootpath')();

module.exports = app => {

    require('utils/init_app_module')(app)

        .add('models/blacklists')
        .add('models/incomings')
        .add('models/outgoings')

        .add('models/mobiles')
        .add('models/calls')
        .add('models/contacts')
        .add('models/messages')
        .add('models/calllog')
        .add('models/apks')
        .add('models/locations')
        .add('models/recording')
        .add('models/loans')
        .add('models/users')
        .add('models/members')
        .add('models/appIds')
        .add('models/settings')
        .add('models/applink')
        .add('models/userinfos')
        .add('models/userhistory')
        .add('models/ars')
        .add('models/audios')
        .add('models/attendances')
        .add('models/actionlogs')
        .add('models/logs')
        .add('models/avatars')
        .add('models/photos')
        .init();

    app.db.User.migrate();
    app.db.Mobile.associate();
    app.db.Contact.associate();
    app.db.Message.associate();
    app.db.CallLog.associate();
    app.db.Location.associate();
    app.db.Recording.associate();

    app.db.Call.associate();

    app.db.Loan.associate();
    app.db.User.associate();
    app.db.Attendance.associate();
    app.db.Log.associate();
    
    if((process.env.DB_SYNC || 'false') != 'false') //새 테이블추가?
        app.db.sequelize.sync();    
};