require('dotenv').config();
const initializer = require('./utils/init_app_module');
const app = require('./app')();

if (!global.clustering_mode) {
    global.clustering_mode = false;
}
if (!global.mobiles) {
    global.mobiles = new Map();
}

if (global.clustering_mode) {
    var http = require('http');

    app.server = http.Server(app);

    initializer(app)
        .add('./logger')
        .add('./upload_dir')
        .add('./db')
        .add('./models')
        .add('./routes')
        .add('./sockets/server')
        .add('./rtsp-server')
        .add('./schedule')
        .init();

    module.exports = { app: app, server: app.server };
} else {

    initializer(app)
        .add('./logger')
        .add('./upload_dir')
        .add('./db')
        .add('./models')
        .add('./routes')
        .add('./http-server')
        .add('./sockets/server')
        .add('./rtsp-server')
        .add('./schedule')
        .init();

    global.app = app;
}

