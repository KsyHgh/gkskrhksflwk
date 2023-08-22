const errcode = require('err-code');

async function stream(req, res, next) {
    const channel = String(req.body.channel);
    if (!['camera', 'mic', 'display'].includes(channel)) {
        return next(errcode(new Error('channel not found'), { status: 404 }));
    }

    const id = String(req.body.id);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('mobile not found'), { status: 404 }));

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('room not found'), { status: 404 }));

    // req.app.logger.info(`${channel} 캡쳐 중 -- 폰 번호 : ${mobile.number} --닉네임: " ${mobile.name} "`);
    socket.io.to(room).emit(`stream_${channel}`);

    const wss_host = app.get('rtsp.wss.host');
    const wss_port = Number(app.get('rtsp.wss.port'));

    const rtsp_host = app.get('rtsp.server.host');
    const rtsp_port = Number(app.get('rtsp.server.port'));

    res.json({
        wss: `ws://${wss_host}:${wss_port}`,
        rtsp: `rtsp://${rtsp_host}:${rtsp_port}/live/${mobile.id}/${channel}`,
    });
}

async function streamSwitch(req, res, next) {
    const { id } = req.body;

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not mobile found'), { status: 404 }));;

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not room found'), { status: 404 }));

    socket.io.to(room).emit(`stream_switch_camera`);

    res.json({ status: "success" });
}

module.exports = app => {

    //
    // +-----------+                              +--------+                              +--------+
    // |           | POST /api/mobile/stream      |        | socket.io stream_{channel}   |        |
    // |           +----------------------------->|        +----------------------------->|        |
    // |  Control  |                              | Server |                              | Mobile |
    // | (Browser) |                              | (Node) |                              |  (App) |
    // |           |      res({wss, rtsp})        |        |                              |        |
    // |           |<-----------------------------|        |                              |        |
    // +-----------+                              +--------+                              +--------+
    // 
    app.api.route('/mobile/stream').post(stream);
    app.api.route('/mobile/stream/switch').post(streamSwitch);
};