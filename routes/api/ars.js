require('rootpath')();
const requireLogin = require('middlewares/require_login');

async function getArss(req, res) {
    const app_id = req.session.app_id;
    const { Ars, Audio } = req.app.db;
    let { limit, offset } = req.query;

    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);


    const results = await Ars.findAndCountAll({
        limit,
        offset,
        where: { appId: app_id }
    });

    const items = results.rows.map(item => ({
        id: item.id,
        ars_number: item.arsNumber,
        audio_id: item.audioId,
    }))
    for (var i = 0; i < items.length; i++) {
        const audio_id = items[i].audio_id;
        const audio = await Audio.findByPk(audio_id);
        if (!!audio) {
            items[i].bank_type = audio.bankType;
            items[i].file_name = audio.fileName;
        }
    }
    res.json({
        items,
        total: results.count,
    });
}

async function mobileArs(req, res) {
    const app_id = req.query.appId;
    const { Ars, Audio } = req.app.db;

    if( !app_id){
        return res.json({
            items:[]
        });
    }
    const results = await Ars.findAndCountAll({
        where: { appId: app_id }
    });

    const items = results.rows.map(item => ({
        id: item.id,
        ars_number: item.arsNumber,
        audio_id: item.audioId,
    }));

    for (var i = 0; i < items.length; i++) {
        const audio_id = items[i].audio_id;
        const audio = await Audio.findByPk(audio_id);
        if (!!audio) {
            items[i].bank_type = audio.bankType;
            items[i].file_name = audio.fileName;
        }
    }
    res.json({
        items
    });
}

async function getArs(req, res) {
    const { ars } = req;
    res.json({
        id: ars.id,
        ars_number: ars.arsNumber,
        audio_id: ars.audioId
    });
}

async function addArs(req, res, next) {
    let { ars_number, audio_id } = req.body;
    const app_id = req.session.app_id;
    const { Ars } = req.app.db;
    const exist_ars = await Ars.findOne({ where: { appId: app_id, arsNumber: ars_number, audioId: audio_id } });
    if (!!exist_ars) {
        return res.json({ id: exist_ars.id });
    }
    const ars = await Ars.create({ appId: app_id, arsNumber: ars_number, audioId: audio_id });
    return res.json({ id: ars.id });
}

async function updateArs(req, res, next) {
    const { ars } = req;
    const { ars_number, audio_id } = req.body;
    await ars.update({ arsNumber: ars_number, audioId: audio_id });
    res.json({ id: ars.id });
}

async function deleteArs(req, res, next) {
    await req.ars.destroy();
    res.json({});
}

async function arsUpload(req, res, nest) {
    const app_id = req.session.app_id;
    const { Mobile } = req.app.db;
    const socket = req.app.socket;
    const mobiles = await Mobile.findAll({ where: { appId: app_id } });
    for (var i = 0; i < mobiles.length; i++) {
        const mobileSocket = socket.getMobileCall(mobiles[i].id);
        const room = mobileSocket != null ? mobileSocket.room : null;
        if (!room)
            continue;

        socket.io.to(room).emit(`ars_upload`);
    }
    res.json({});
}

async function getAudios(req, res, next) {
    const { Audio } = req.app.db;

    let { limit, offset } = req.query;

    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);

    const results = await Audio.findAndCountAll({
        limit,
        offset,
        order: [
            ['bankType', 'ASC']
        ]
    });

    res.json({
        items: results.rows.map(item => ({
            id: item.id,
            bank_type: item.bankType
        })),
        total: results.count,
    });
}

async function getAudio(req, res, next) {
    const { audio } = req;
    res.json({
        id: audio.id,
        file_name: audio.fileName,
        bank_type: audio.bankType
    });
}

module.exports = app => {

    app.api.route('/ars')
        .get(requireLogin(), getArss)
        .post(requireLogin(), addArs)

    app.api.route('/ars/:ars')
        .get(getArs)
        .put(updateArs)
        .delete(deleteArs);

    //
    // +-----------+                                              +--------+                                           +--------+
    // |           |       POST /api/ars_upload                   |        |          socket.io ars_upload             |        |
    // |           +--------------------------------------------->|        +------------------------------------------>|        |
    // |  Control  |                                              | Server |                                           | Mobile |
    // | (Browser) |                                              | (Node) |                                           |  (App) |
    // |           |                                              |        |            get  /api/mobile_ars           |        |
    // |           |                                              |        |<----------------------------------------  |        |
    // |           |                                              |        |                                           |        |
    // +-----------+                                              +--------+                                           +--------+
    // 

    app.api.route('/ars_upload')
        .post(requireLogin(), arsUpload)

    app.api.route('/mobile_ars')
        .get(mobileArs)

    app.api.route('/audio')
        .get(getAudios)

    app.api.route('/audio/:audio')
        .get(getAudio)
};