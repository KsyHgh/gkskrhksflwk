const i18n = require('i18n');

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

function alive(req, res, next) {
    const data = {
        status: true
    };
    return res.json(data);
}

function setLocale(app) {
    app.use(require('middlewares/locales')());
}

module.exports = app => {
    registerTestLogin(app);
    registerUserSession(app);
    setLocale(app);

    require('routes/params')(app);

    require('routes/api')(app);

    require('routes/logs')(app);

    // if (process.env.TEST_USER) {
    require('routes/test')(app);
    // }

    require('routes/users')(app);
    require('routes/admin')(app);
    require('routes/errors')(app);

    app.get('/', (req, res) => res.redirect('/admin/mobiles'));
    app.get("/api/alive", alive);
    
    app.get('/i18n/:locale', (req, res) => {
        req.session.locale = req.params.locale;
        res.cookie('locale', req.params.locale);
        res.redirect('back');
    });
};