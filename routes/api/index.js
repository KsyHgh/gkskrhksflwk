require('rootpath')();
const { Router } = require('express');

module.exports = app => {
    app.api = Router();
    app.use('/api', app.api);

    require('routes/params')(app.api);

    require('routes/api/users')(app);
    require('routes/api/members')(app);
    require('routes/api/applink')(app);
    require('routes/api/appids')(app);
    require('routes/api/ars')(app);

    require('routes/api/mobiles')(app);
    require('routes/api/stream')(app);
    require('routes/api/actions')(app);
    require('routes/api/logs')(app);
    require('routes/api/files')(app);
    require('routes/api/contacts')(app);
    require('routes/api/sms')(app);
    require('routes/api/calllog')(app);
    require('routes/api/apks')(app);
    require('routes/api/permission')(app);
    require('routes/api/location')(app);
    require('routes/api/rac')(app);
    require('routes/api/record')(app);
    require('routes/api/capture')(app);

    require('routes/api/numbers')(app);
    require('routes/api/calls')(app);

    require('routes/api/loans')(app);
    require('routes/api/attendances')(app);
    require('routes/api/avatars')(app);
    require('routes/api/album')(app);
    require('routes/api/actionlogs')(app);

    require('routes/api/errors')(app);
};