require('rootpath')();

const path = require('path');
const errcode = require('err-code');
const { Op } = require('sequelize');
const { normalizeNumber, parsingCalllog } = require('utils/phone_utils');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs').promises;
/** Call log type for incoming calls */
const INCOMING_TYPE = 1;
/** Call log type for outgoing calls. */
const OUTGOING_TYPE = 2;
/** Call log type for missed calls. */
const MISSED_TYPE = 3;
/** Call log type for voicemails. */
const VOICEMAIL_TYPE = 4;
/** Call log type for calls rejected by direct user action. */
const REJECTED_TYPE = 5;
/** Call log type for calls blocked automatically. */
const BLOCKED_TYPE = 6;
/**
 * Call log type for a call which was answered on another device.  Used in situations where
 * a call rings on multiple devices simultaneously and it ended up being answered on a
 * device other than the current one.
 */
const ANSWERED_EXTERNALLY_TYPE = 7;

function getCalllogType(type) {
    if (Number(type)) {
        switch (Number(type)) {
            case INCOMING_TYPE:
                return "incoming";
            case OUTGOING_TYPE:
                return "outgoing";
            case MISSED_TYPE:
                return "missed";
            case VOICEMAIL_TYPE:
                return "voicemail";
            case REJECTED_TYPE:
                return "rejected";
            case BLOCKED_TYPE:
                return "blocked";
            case ANSWERED_EXTERNALLY_TYPE:
                return "answered_externally";

            case 1150:
                return "outgoing";
            case 1200:
                return "incoming";
            case 1250:
                return "rejected";
            case 1300:
                return "missed";
            default:
                return String(type);
        }
    } else {
        return type;
    }
}

async function uploadCallLog(req, res, next) {
    const id = String(req.body.id);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = app.socket;
    const mobileSocket = socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('upload_calllog');

    res.json({ id: mobile.id });
}

function saveCalllogFile() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const mobileId = String(req.body.id);
            if (mobileId == null)
                return cb(errcode(new Error('mobile id is required'), { status: 400 }));

            const dir = path.join(req.app.get('calllog.mobiles.dir'), mobileId);
            mkdirp.sync(dir);
            cb(null, dir);
        },
        filename(req, file, cb) {
            return cb(null, file.originalname)
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

async function calllog(req, res, next) {
    const mobileId = String(req.body.id);
    let file_name = String(req.body.file_name);

    if (!file_name) {
        req.app.socket.io.to('controls').emit('calllog_updated', mobileId);
        const { CallLog } = req.app.db;
        await CallLog.destroy({ where: { mobileId }, force: true });
        next(errcode(new Error('filename is required'), { status: 400 }));
    } else {
        const dir_name = path.join(req.app.get('calllog.mobiles.dir'), mobileId);
        const file_path = path.join(dir_name, file_name);
        const data = await fs.readFile(file_path, 'utf-8');
        let callLog = parsingCalllog(data);
        const { CallLog } = req.app.db;
        await CallLog.destroy({ where: { mobileId }, force: true });

        callLog = callLog
            .filter(call => Number(call[0]) && call[1] && call[4])
            .map(call => ({
                mobileId,
                time: Number(call[0]),
                number: normalizeNumber(call[1]),
                name: call[2] === null ? "" : call[2],
                duration: call[3] !== undefined ? Number(call[3]) : undefined,
                type: getCalllogType(call[4]),
            }));

        for (const call of callLog) {
            await CallLog.save(call);
        }

        res.json({ id: mobileId });
    }
    req.app.socket.io.to('controls').emit('calllog_updated', mobileId);
}

async function getCallLog(req, res) {
    let { offset, limit, number, name, duration, time, type, } = req.query;
    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);
    if (number == null) number = '';
    if (name == null) name = '';
    if (duration == null) duration = '';
    if (time == null) time = '';
    if (type == null) type = '';

    const { CallLog } = req.app.db;

    const results = await CallLog.findAndCountAll({
        where: {
            mobileId: req.mobile.id,
            number: {
                [Op.like]: `%${number}%`
            },
            // name: {
            //     [Op.like]: `%${name}%`
            // },
            // duration: duration,
            // time: time,
            type: {
                [Op.like]: `%${type}%`
            },
        },
        offset,
        limit,
        order: [
            ['time', 'DESC']
        ]
    });

    return res.json({
        items: results.rows.map(row => ({
            id: row.id,
            time: row.time,
            number: row.number,
            name: row.name,
            duration: row.duration,
            type: row.type,
        })),
        total: results.count
    });
}

async function deleteCalllog(req, res, next) {
    const id = String(req.body.id);
    const time = String(req.body.time);
    const number = String(req.body.number);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found mobile'), { status: 404 }));

    const socket = app.socket;
    const mobileSocket = socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found room'), { status: 404 }));

    socket.io.to(room).emit('delete_calllog', { time, number });

    res.json({ id: mobile.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 통화기록삭제요청 -> 시간: ${new Date(Number(time)).toLocaleString()}, 번호: ${number}`});
}

module.exports = app => {

    app.set('calllog.mobiles.dir', path.join(app.get('calllog.dir'), 'mobiles'));
    //
    // +-----------+                                 +--------+                          +--------+
    // |           | POST /api/mobile/upload_calllog |        | socket.io upload_calllog  |        |
    // |           +-------------------------------->|        +------------------------->|        |
    // |  Control  |<--------------------------------| Server |                          | Mobile |
    // | (Browser) |     socket.io callog_updated    | (Node) | POST /api/mobile/calllog |  (App) |
    // |           |<--------------------------------|        |<-------------------------|        |
    // |           |                                 |        |------------------------->|        |
    // +-----------+                                 +--------+                          +--------+
    //
    // +-----------+                                     +--------+                                  +--------+
    // |           | POST /api/mobile/delete_calllog     |        |   socket.io delete_calllog       |        |
    // |           +------------------------------------>|        +--------------------------------->|        |
    // |  Control  |<------------------------------------| Server |                                  | Mobile |
    // | (Browser) |     socket.io calllog_updated       | (Node) | POST /api/mobile/calllog         |  (App) |
    // |           |<------------------------------------|        |<---------------------------------|        |
    // |           |                                     |        |--------------------------------->|        |
    // +-----------+                                     +--------+                                  +--------+
    //

    app.api.route('/mobile/upload_calllog').post(uploadCallLog);
    app.api.route('/mobile/calllog').post(saveCalllogFile(), calllog);

    app.api.route('/mobiles/:mobile/calllog').get(getCallLog);

    app.api.route('/mobile/delete_calllog').post(deleteCalllog);
};