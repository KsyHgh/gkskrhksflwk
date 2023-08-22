function error(err, req, res, next) {
    res.status(err.status);

    switch (err.status) {
        case 404:
            return res.render('errors/404.ejs');
        case 401:
            return res.render('errors/401.ejs');
        default:
            return res.send(`Error ${err.status}`);
    }
}

module.exports = app => {
    app.use(error);
};