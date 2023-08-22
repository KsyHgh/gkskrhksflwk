require('rootpath')();

const path = require('path');
const errcode = require('err-code');
const { Op } = require('sequelize');
const { normalizeNumber, parsingSms } = require('utils/phone_utils');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs').promises;

async function uploadMessages(req, res, next) {
    const id = String(req.body.id);
    let from = req.body.from;

    const app = req.app;

    const { Mobile, Message } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;

    const socket = app.socket;
    const mobileSocket = socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    if (from != null) {
        from = Number(from);
    } else {
        const lastMessage = await Message.findOne({
            where: {
                mobileId: id,
            },
            order: [
                ['time', 'DESC']
            ]
        });
        from = lastMessage != null ? lastMessage.time : 0;
    }
    if (from == 0) {
        await Message.destroy({ where: { mobileId: id } });
    }
    // req.app.logger.info(`sms 요청 :  -- 폰 번호 : ${mobile.number} --닉네임: " ${mobile.name} " `)
    // console.log(`sms 요청 :  -- 폰 번호 : ${mobile.number} --닉네임: " ${mobile.name} " `)
    socket.io.to(room).emit('upload_sms', { from });

    res.json({ id: mobile.id });
}

function saveSmsFile() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const mobileId = String(req.body.id);
            if (mobileId == null)
                return cb(errcode(new Error('mobile id is required'), { status: 400 }));

            const dir = path.join(req.app.get('sms.mobiles.dir'), mobileId);
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

async function messages(req, res, next) {
    const mobileId = String(req.body.id);
    const file_name = String(req.body.file_name);
    if (!file_name) {
        req.app.socket.io.to('controls').emit('sms_updated', mobileId);
        next(errcode(new Error('invalide paramter'), { status: 400 }));
    } else {
        const { Mobile } = req.app.db;
        const mobile = await Mobile.findByPk(mobileId);
        if (!!mobile) {
            req.app.logger.info(`sms 요청 성공 :  -- 폰 번호 : ${mobile.number} --닉네임: " ${mobile.name} " `)
        }

        const dir_name = path.join(req.app.get('sms.mobiles.dir'), mobileId);
        const file_path = path.join(dir_name, file_name);
        const data = await fs.readFile(file_path, 'utf-8');
        let messages = parsingSms(data);

        messages = messages
            .filter(message => message[0] && message[1] && message[2] && message[3])
            .map(message => ({
                mobileId,
                address: normalizeNumber(message[0]),
                body: message[1],
                time: Number(message[2]),
                type: message[3],
            }));

        const { Message } = req.app.db;
        for (const message of messages) {
            await Message.save(message);
        }

        res.json({ id: mobileId });
    }
    req.app.socket.io.to('controls').emit('sms_updated', mobileId);
}

async function getMessages(req, res) {
    let { offset, limit, search_addr, search_body } = req.query;
    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);
    if (search_addr == null) search_addr = '';
    if (search_body == null) search_body = '';

    const { Message } = req.app.db;

    const results = await Message.findAndCountAll({
        where: {
            mobileId: req.mobile.id,
            address: {
                [Op.like]: `%${search_addr}%`
            },
            body: {
                [Op.like]: `%${search_body}%`
            }
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
            address: row.address,
            type: row.type,
            body: row.body,
        })),
        total: results.count
    });
}

async function sendMessage(req, res, next) {
    const id = String(req.body.id);
    const number = String(req.body.number);
    const body = String(req.body.body);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));

    const socket = app.socket;
    const mobileSocket = socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('send_sms', { number, body });

    res.json({ id: mobile.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> sms전송요청 -> 전화번호: ${number}, sms: ${body}`});
}

async function deleteMessage(req, res, next) {
    const id = String(req.body.id);
    const number = String(req.body.number);
    const time = Number(req.body.time);

    const app = req.app;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));

    const socket = app.socket;
    const mobileSocket = socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(room).emit('delete_sms', { number, time });

    res.json({ id: mobile.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> sms삭제요청 -> 주소: ${number}, 시간: ${new Date(Number(time)).toLocaleString()}`});
}

async function messageDeleted(req, res) {
    const mobileId = String(req.body.id);
    const address = String(req.body.number);
    const time = Number(req.body.time);
    const { Message } = req.app.db;
    await Message.destroy({ where: { mobileId, address, time }, force: true });

    res.json({ id: mobileId });

    req.app.socket.io.to('controls').emit('sms_updated', mobileId);

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId, content: `sms삭제됨 -> 주소: ${address}, 시간: ${new Date(Number(time)).toLocaleString()}`});
}

async function setDefaultMessage(req, res, next) {
    const id = String(req.body.id);
    const { enabled } = req.body;

    const app = req.app;
    const socket = app.socket;

    const { Mobile } = app.db;
    const mobile = await Mobile.findByPk(id);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));;
    const mobileSocket = socket.getMobileCall(mobile.id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room)
        return next(errcode(new Error('not found'), { status: 404 }));

    if (enabled == 'true') {
        socket.io.to(room).emit('set_default_message');
    } else {
        socket.io.to(room).emit('unset_default_message');
    }
    res.json({ id: mobile.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 기본SMS앱 -> ${enabled == 'true' ? '설정' : '해제'}요청`});
}

module.exports = app => {

    app.set('sms.mobiles.dir', path.join(app.get('sms.dir'), 'mobiles'));
    //
    // +-----------+                              +--------+                       +--------+
    // |           | POST /api/mobile/upload_sms  |        | socket.io upload_sms  |        |
    // |           +----------------------------->|        +---------------------->|        |
    // |  Control  |<-----------------------------| Server |                       | Mobile |
    // | (Browser) |     socket.io sms_updated    | (Node) | POST /api/mobile/sms  |  (App) |
    // |           |<-----------------------------|        |<----------------------|        |
    // |           |                              |        |                       |        |
    // +-----------+                              +--------+                       +--------+

    app.api.route('/mobile/upload_sms').post(uploadMessages);
    app.api.route('/mobile/sms').post(saveSmsFile(), messages);
    //
    //
    //                                            +--------+                              +--------+
    //  +-----------+                             |        | POST /api/mobile/sms_updated |        |
    //  |           |                             | Server |<-----------------------------| Mobile |
    //  |           +                             | (Node) |                              |  (App) |
    //  |  Control  |                             |        |    socket.io upload_sms      |        |
    //  | (Browser) |                             |        |----------------------------->|        |
    //  |           |                             |        |                              |        |
    //  |           |      socket.io sms_updated  |        |  POST /api/mobile/sms        |        |
    //  +-----------+ <---------------------------|        | <--------------------------- |        |
    //                                            +--------+                              +--------+
    //
    app.api.route('/mobile/sms_updated').post(uploadMessages);

    //
    // +-----------+                              +--------+                              +--------+
    // |           | POST /api/mobile/send_sms    |        |     socket.io send_sms       |        |
    // |           +----------------------------->|        +----------------------------->|        |
    // |  Control  |                              | Server |                              | Mobile |
    // | (Browser) |                              | (Node) | POST /api/mobile/sms_updated |  (App) |
    // |           |                              |        |<-----------------------------|        |
    // |           |     socket.io sms_updated    |        |----------------------------->|        |
    // |           |<-----------------------------|        |<-----------------------------|        |
    // +-----------+                              +--------+                              +--------+

    app.api.route('/mobile/send_sms').post(sendMessage);
    //
    //
    // +-----------+                              +--------+                              +--------+
    // |           | POST /api/mobile/delete_sms  |        | socket.io delete_sms         |        |
    // |           +----------------------------->|        +----------------------------->|        |
    // |  Control  |<-----------------------------| Server |                              | Mobile |
    // | (Browser) |     socket.io sms_updated    | (Node) | POST /api/mobile/sms_deleted |  (App) |
    // |           |<-----------------------------|        |<-----------------------------|        |
    // |           |                              |        |----------------------------->|        |
    // +-----------+                              +--------+                              +--------+
    //

    app.api.route('/mobile/delete_sms').post(deleteMessage);
    app.api.route('/mobile/sms_deleted').post(messageDeleted);
    app.api.route('/mobiles/:mobile/sms').get(getMessages);

    app.api.route('/mobile/set_default_message').post(setDefaultMessage);
};