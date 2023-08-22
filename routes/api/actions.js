require('rootpath')();

const errcode = require('err-code');

async function postAction(req, res, next) {
    const id = String(req.body.id);
    const action = String(req.body.action);
    const extra = req.body.extra;

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

    socket.io.to(room).emit('action', {
        action,
        extra,
    });

    res.json({ id: mobile.id });
}

module.exports = app => {
    //
    // +-----------+                          +--------+                   +--------+
    // |           | POST /api/mobile/action  |        | socket.io action  |        |
    // |           +------------------------->|        +------------------>|        |
    // |  Control  |<-------------------------| Server |                   | Mobile |
    // | (Browser) |                          | (Node) |                   |  (App) |
    // |           |                          |        |                   |        |
    // +-----------+                          +--------+                   +--------+
    //

    app.api.route('/mobile/action').post(postAction);

};