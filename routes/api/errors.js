require('rootpath')();

function error(err, req, res, next) {
    res.status(err.status).json({ error: err.message });
}

module.exports = app => {
    app.api.use(error);
};