require('rootpath')();
const errcode = require('err-code');

async function requestRAC(req, res, next) {
    const {id, type} = req.body;
    if(type != '1' && type != '2')
        return res.status(404).json({msg: 'not correct request'});
    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return res.status(404).json({msg: 'not found'});

    const socket = app.socket;
    const mobileSocket = type == '1' ? socket.getMobileMain(mobile.id) : socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return res.status(404).json({msg: 'not found'});

    socket.io.to(room).emit('request_rac');

    res.json({ id: mobile.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> ${type == '1' ? '메인앱' : '콜앱'} 접근성 요청`});
}

module.exports = app => {
    //
    // +-----------+                                        +--------+                           +--------+
    // |           | POST /api//mobile/request_rac          |        | socket.io request_rac     |        |
    // |           +--------------------------------------->|        +-------------------------->|        |
    // |  Control  |                                        | Server |                           | Mobile |
    // | (Browser) |                                        | (Node) |                           |  (App) |
    // |           |                                        |        |                           |        |
    // |           |                                        |        |                           |        |
    // +-----------+                                        +--------+                           +--------+
    //

    app.api.route('/mobile/request_rac').post(requestRAC);
};