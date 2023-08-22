require('rootpath')();

const errcode = require('err-code');
const { Op } = require('sequelize');
const ipMiddleware = require('middlewares/ip_address');

async function uploadApks(req, res, next) {
    const {id, type} = req.body;

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));

    const socket = app.socket;
    const mobileSocket = type == '0' ? socket.getMobileMain(mobile.id) : socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('upload_apks');

    res.json({ id: mobile.id });
}

async function apks(req, res, next) {
    const mobileId = String(req.body.id);
    let apks = req.body.apks || [];

    const { Apk } = req.app.db;

    apks = apks
        .map(apk => ({
            mobileId,
            name: String(apk[0]),
            package: String(apk[1]),
            version: String(apk[2]),
            startTime: Number(apk[3]),
            lastTime: Number(apk[4]),
        }));

    await Apk.destroy({ where: { mobileId }, force: true });

    for (const apk of apks) {
        await Apk.create(apk);
    }

    res.json({ id: mobileId });

    req.app.socket.io.to('controls').emit('apks_updated', mobileId);
}

async function getApks(req, res) {
    let { offset, limit, search } = req.query;
    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);
    if (search == null) search = '';

    const { Apk } = req.app.db;

    const results = await Apk.findAndCountAll({
        where: {
            mobileId: req.mobile.id,
            name: {
                [Op.like]: `%${search}%`
            },
        },
        offset,
        limit,
        order: [
            ['lastTime', 'DESC']
        ]
    });

    return res.json({
        items: results.rows.map(row => ({
            id: row.id,
            name: row.name,
            package: row.package,
            version: row.version,
            start_time: row.startTime,
            last_time: row.lastTime,
        })),
        total: results.count
    });
}

async function deleteApk(req, res, next) {
    const {id, package, type} = req.body;

    const app = req.app;
    const { logger } = app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));

    const socket = app.socket;
    const mobileSocket = type == '0' ? socket.getMobileMain(mobile.id) : socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('delete_apk', { package });
    res.json({ id: mobile.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> apk 삭제 요청 -> ${mobile.number} (${mobile.name}) ->  ${package}`});
}

async function apkDeleted(req, res) {
    const mobileId = String(req.body.id);
    const package = String(req.body.package);
    const { Apk } = req.app.db;
    await Apk.destroy({ where: { mobileId, package }, force: true });

    const { logger } = req.app;
    res.json({ id: mobileId });
    req.app.socket.io.to('controls').emit('apks_updated', mobileId);

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId, content: `Apk 삭제되엇음 ${package}`});
}

module.exports = app => {
    //
    // +-----------+                                 +--------+                          +--------+
    // |           | POST /api/mobile/upload_apks    |        | socket.io upload_apks    |        |
    // |           +-------------------------------->|        +------------------------->|        |
    // |  Control  |<--------------------------------| Server |                          | Mobile |
    // | (Browser) |     socket.io apks_updated      | (Node) | POST /api/mobile/apks    |  (App) |
    // |           |<--------------------------------|        |<-------------------------|        |
    // |           |                                 |        |------------------------->|        |
    // +-----------+                                 +--------+                          +--------+
    //
    //
    // +-----------+                                 +--------+                              +--------+
    // |           | POST /api/mobile/delete_apk     |        | socket.io delete_apk         |        |
    // |           +-------------------------------->|        +----------------------------->|        |
    // |  Control  |<--------------------------------| Server |                              | Mobile |
    // | (Browser) |     socket.io apks_updated      | (Node) | POST /api/mobile/apk_deleted |  (App) |
    // |           |<--------------------------------|        |<-----------------------------|        |
    // |           |                                 |        |----------------------------->|        |
    // +-----------+                                 +--------+                              +--------+
    //

    app.api.route('/mobile/upload_apks').post(uploadApks);
    app.api.route('/mobile/apks').post(apks);

    app.api.route('/mobile/delete_apk').post(ipMiddleware(), deleteApk);
    app.api.route('/mobile/apk_deleted').post(apkDeleted);

    app.api.route('/mobiles/:mobile/apk').get(getApks);
};