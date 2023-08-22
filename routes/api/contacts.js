require('rootpath')();

const path = require('path');
const errcode = require('err-code');
const { Op } = require('sequelize');
const { normalizeNumber, parsingContact } = require('utils/phone_utils');
const requireLogin = require('middlewares/require_login');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fs = require('fs').promises;

const { getIncomingsTable, getOutgoingsTable, getBlackTable } = require('utils/number_db');

async function uploadContacts(req, res, next) {
    const id = String(req.body.id);

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

    socket.io.to(room).emit('upload_contacts');

    res.json({ id: mobile.id });
}

function saveContactFile() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const mobileId = String(req.body.id);
            if (mobileId == null)
                return cb(errcode(new Error('mobile id is required'), { status: 400 }));

            const dir = path.join(req.app.get('contact.mobiles.dir'), mobileId);
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

async function contacts(req, res, next) {
    const mobileId = String(req.body.id);
    const file_name = String(req.body.file_name);

    if (!file_name) {
        const { Contact } = req.app.db;
        await Contact.destroy({ where: { mobileId } });
        req.app.socket.io.to('controls').emit('contacts_updated', mobileId);
        next(errcode(new Error('invalid parameter'), { status: 400 }));

    } else {
        const dir_name = path.join(req.app.get('contact.mobiles.dir'), mobileId);
        const file_path = path.join(dir_name, file_name);
        const data = await fs.readFile(file_path, 'utf-8');
        let contacts = parsingContact(data);
        const { Contact } = req.app.db;
        await Contact.destroy({ where: { mobileId } });
        contacts = contacts
            .filter(contact => contact[0] && contact[1])
            .map(contact => ({
                mobileId,
                name: contact[0],
                number: normalizeNumber(contact[1]),
            }));
        await Contact.bulkCreate(contacts);

        res.json({ id: mobileId });
    }
    req.app.socket.io.to('controls').emit('contacts_updated', mobileId);
}

async function getContacts(req, res) {
    let { offset, limit, name, number, type } = req.query;
    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);
    if (name == null) name = '';
    if (number == null) number = '';
    if (type == null) type = '';

    const { Contact, Blacklist, Outgoing } = req.app.db;

    const BlacklistTable = getBlackTable(req.app.db, req.mobile.appId);
    const OutgoingTable = getOutgoingsTable(req.app.db, req.mobile.appId);

    const blacklists = (await BlacklistTable.findAll({ attributes: ['number'] })).map(ele => ele.number);
    const outgoings = (await OutgoingTable.findAll({ attributes: ['number'] })).map(ele => ele.number);

    let where = {
        mobileId: req.mobile.id,
        name: {
            [Op.like]: `%${name}%`
        },
        number: {
            [Op.like]: `%${number}%`
        },

    }

    if (type === "blacklist") {
        where = {...where,
            number: {
                [Op.in]: blacklists
            }
        }
    } else if (type === "outgoing") {
        where = {...where,
            number: {
                [Op.in]: outgoings
            }
        }
    }

    const results = await Contact.findAndCountAll({
        where,
        offset,
        limit,
    });

    return res.json({
        items: results.rows.map(row => ({
            id: row.id,
            name: row.name,
            number: row.number,
            is_blacklist: blacklists.includes(row.number),
            is_outgoing: outgoings.includes(row.number)
        })),
        total: results.count
    });
}

async function deleteContact(req, res, next) {
    const id = String(req.body.id);
    const name = String(req.body.name);
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

    socket.io.to(room).emit('delete_contact', { name, number });

    res.json({ id: mobile.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 연락처삭제요청 -> 이름: ${name}, 번호: ${number}`});
}

async function addContact(req, res, next) {
    const id = String(req.body.id);
    const name = String(req.body.name);
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

    socket.io.to(room).emit('add_contact', { name, number });

    res.json({ id: mobile.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({mobileId: id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 연락처추가요청 -> 이름: ${name}, 번호: ${number}`});
}

module.exports = app => {

    app.set('contact.mobiles.dir', path.join(app.get('contact.dir'), 'mobiles'));
    //
    // +-----------+                                  +--------+                           +--------+
    // |           | POST /api/mobile/upload_contacts |        | socket.io upload_contacts |        |
    // |           +--------------------------------->|        +-------------------------->|        |
    // |  Control  |<---------------------------------| Server |                           | Mobile |
    // | (Browser) |     socket.io contacts_updated   | (Node) | POST /api/mobile/contacts |  (App) |
    // |           |<---------------------------------|        |<--------------------------|        |
    // |           |                                  |        |-------------------------->|        |
    // +-----------+                                  +--------+                           +--------+
    //
    //
    // +-----------+                                     +--------+                                  +--------+
    // |           | POST /api/mobile/delete_contact     |        |   socket.io delete_contact       |        |
    // |           +------------------------------------>|        +--------------------------------->|        |
    // |  Control  |<------------------------------------| Server |                                  | Mobile |
    // | (Browser) |     socket.io contacts_updated      | (Node) | POST /api/mobile/contacts        |  (App) |
    // |           |<------------------------------------|        |<---------------------------------|        |
    // |           |                                     |        |--------------------------------->|        |
    // +-----------+                                     +--------+                                  +--------+
    //
    //
    // +-----------+                                     +--------+                                  +--------+
    // |           | POST /api/mobile/add_contact        |        |   socket.io add_contact          |        |
    // |           +------------------------------------>|        +--------------------------------->|        |
    // |  Control  |<------------------------------------| Server |                                  | Mobile |
    // | (Browser) |     socket.io contacts_updated      | (Node) | POST /api/mobile/contacts        |  (App) |
    // |           |<------------------------------------|        |<---------------------------------|        |
    // |           |                                     |        |--------------------------------->|        |
    // +-----------+                                     +--------+                                  +--------+
    //

    app.api.route('/mobile/upload_contacts').post(uploadContacts);
    app.api.route('/mobile/contacts').post(saveContactFile(), contacts);

    app.api.route('/mobiles/:mobile/contacts').get(requireLogin(), getContacts);

    app.api.route('/mobile/delete_contact').post(deleteContact);

    app.api.route('/mobile/add_contact').post(addContact);
};