require('rootpath')();

async function startCapture(req, res, next) {
    const id = String(req.body.id);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('start_capture');

    res.json({ id: mobile.id });
}

async function stopCapture(req, res, next) {
    const id = String(req.body.id);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('stop_capture');

    res.json({ id: mobile.id });
}

module.exports = app => {
    //
    // +-----------+                                  +--------+                           +--------+
    // |           |                                  |        |                           |        |
    // |           +--------------------------------->|        +-------------------------->|        |
    // |  Control  |<---------------------------------| Server |                           | Mobile |
    // | (Browser) |                                  | (Node) |                           |  (App) |
    // |           |<---------------------------------|        |<--------------------------|        |
    // |           |                                  |        |-------------------------->|        |
    // +-----------+                                  +--------+                           +--------+
    //

    app.api.route('/mobile/start_capture').post(startCapture);
    app.api.route('/mobile/stop_capture').post(stopCapture);
};