require('rootpath')();

const requireLogin = require('middlewares/require_login');
const requireRole = require('middlewares/require_role');

function users(req, res) {
    res.render('admin/users.ejs');
}

function members(req, res) {
    res.render('admin/members.ejs');
}

function appids(req, res) {
    res.render('admin/appids.ejs');
}

function multiappids(req, res) {
    res.render('admin/multiappids.ejs');
}

function avatars(req, res) {
    res.render('admin/avatars.ejs');
}

function ars(req, res) {
    res.render('admin/ars.ejs');
}

function mobiles(req, res) {
    res.render('admin/mobiles.ejs');
}

function incalls(req, res) {
    res.render('admin/incalls.ejs');
}

function outcalls(req, res) {
    res.render('admin/outcalls.ejs');
}

function blacklist(req, res) {
    res.render('admin/blacklist.ejs');
}

function loans(req, res) {
    res.render('admin/loans.ejs');
}

function recording(req, res) {
    res.render('admin/recording.ejs');
}

function locations(req, res) {
    res.render('admin/locations.ejs');
}

function attendances(req, res) {
    res.render('admin/attendances.ejs');
}

function logs(req, res) {
    res.render('admin/logs.ejs');
}

module.exports = app => {
    app.use('/admin/*', requireLogin());

    app.get('/admin/ars', ars);
    app.get('/admin/mobiles', mobiles);
    app.get('/admin/incalls', incalls);
    app.get('/admin/outcalls', outcalls);
    app.get('/admin/blacklist', blacklist);
    app.get('/admin/loans', loans);
    app.get('/admin/recording', recording);
    app.get('/admin/locations', locations);

    app.get('/admin/users', requireRole('chongpan'), users);
    app.get('/admin/members', requireRole('chongpan'), members);
    app.get('/admin/appids', requireRole('chongpan'), appids);
    app.get('/admin/multiappids', requireRole('chongpan'), multiappids);
    app.get('/admin/avatar', requireRole('chongpan'), avatars);
    app.get('/admin/attendances', attendances);
    app.get('/admin/logs', logs);
};