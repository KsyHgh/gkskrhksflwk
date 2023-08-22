require('rootpath')();
const errcode = require('err-code');
const { Op } = require('sequelize');
var xlsx = require('node-xlsx');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const mkdirp = require('mkdirp');
const requireLogin = require('middlewares/require_login');
const { getIncomingsTable, getOutgoingsTable, getBlackTable } = require('utils/number_db');

async function getOutgoings(req, res) {

    let { limit, offset, id: mobile_id, name, number, number_real, appId } = req.query;

    const { Mobile } = req.app.db;
    const mobile = await Mobile.findByPk(mobile_id);
    if (!appId) {
        appId = req.session.app_id;
    } else {
        if (!!mobile) {
            appId = mobile.appId;
        }
    }
    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);

    if (name == null) name = '';
    if (number == null) number = '';
    if (number_real == null) number_real = '';

    let where = {
        name: {
            [Op.like]: `%${name}%`
        },
        number: {
            [Op.like]: `%${number}%`
        },
        numberReal: {
            [Op.like]: `%${number_real}%`
        },
        appId: appId
    };

    if (mobile_id) {
        where = {
            ...where,
            [Op.or]: [{ mobileId: mobile_id }, { mobileId: '' }]
        }
    }

    const OutgoingTable = getOutgoingsTable(req.app.db, appId);

    const results = await OutgoingTable.findAndCountAll({
        where,
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ]
    });

    res.json({
        items: results.rows.map(item => ({
            id: item.id,
            mobile_id: item.mobileId,
            name: item.name,
            number: item.number,
            number_real: item.numberReal,
            enabled: item.enabled,
            is_special: item.isSpecial,
            updated_at: item.updatedAt
        })),
        total: results.count,
    });
}

async function addOutgoing(req, res, next) {
    let { name, number, number_real: numberReal, enabled, mobile_id: mobileId } = req.body;
    if (!mobileId) {
        mobileId = '';
    }

    if (!name) {
        name = '';
    }

    const appId = req.session.app_id;

    const OutgoingTable = getOutgoingsTable(req.app.db, appId);

    if (!numberReal)
        numberReal = req.session.number_real;

    if (!String(number) || !String(numberReal)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    if (![true, false, 'true', 'false'].includes(enabled)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }

    const exist_outgoing = await OutgoingTable.findOne({ where: { number, mobileId, appId } });
    if (!!exist_outgoing) {
        return res.json({ msg: "Already exit!" });
    }

    const [outgoing, created] = await OutgoingTable.findOrCreate({ where: { number, mobileId, appId }, defaults: { name, number, numberReal, enabled, mobileId, appId }, });
    if (!created) {
        await outgoing.update({ name, number, numberReal, enabled, mobileId, appId });
    }

    res.json({ id: outgoing.id });

    const data = {
        appId: appId,
        id: outgoing.id,
        name,
        number,
        numberReal,
        enabled,
        is_special: outgoing.isSpecial
    }

    req.app.socket.io.to('mobilesCall').emit('outgoing_create_one', data);

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 강수추가조작 -> 이름: ${name}, 발신번호: ${number}, 상태: ${enabled}`});
}

async function addOutgoingList(req, res, next) {
    let { name_arr, number_arr, enabled } = req.body;
    if (!name_arr || !number_arr) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }

    const appId = req.session.app_id;
    const OutgoingTable = getOutgoingsTable(req.app.db, appId);
    const numberReal = req.session.number_real;
    const mobileId = '';

    if (!String(numberReal)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    if (![true, false, 'true', 'false'].includes(enabled)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    for (var i = 0; i < number_arr.length; i++) {
        const exist_outgoing = await OutgoingTable.findOne({ where: { number: number_arr[i], mobileId, appId } });
        if (!!exist_outgoing) {
            continue;
        }
        const outgoing = await OutgoingTable.create({ name: name_arr[i], number: number_arr[i], numberReal, enabled, mobileId, appId });
        const data = {
            appId: appId,
            id: outgoing.id,
            name: (!!name_arr[i]) ? name_arr[i] : "",
            number: number_arr[i],
            numberReal,
            enabled,
            is_special: outgoing.isSpecial
        }

        req.app.socket.io.to('mobilesCall').emit('outgoing_create_one', data);
        const {ActionLog} = req.app.db;
        await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 연락처에서 강수추가조작 -> 이름: ${(!!name_arr[i]) ? name_arr[i] : ""}, 발신번호: ${number_arr[i]}, 실제수신전환번호: ${numberReal}, 상태: ${enabled}, 대표: ${outgoing.isSpecial}`});
    }
    res.json({ status: "success" });
}

async function addDefaultOutgoing(req, res, next) {

    const { BlackNumber } = req.app.db;

    const appId = req.session.app_id;

    const OutgoingTable = getOutgoingsTable(req.app.db, appId);

    await OutgoingTable.destroy({ where: {}, truncate: true });

    const enabled = true;
    const numberReal = req.session.number_real;

    let defaultNumbers = await BlackNumber.findAll();

    defaultNumbers = defaultNumbers.map(blackNumber => ({
        name: blackNumber.name,
        number: blackNumber.number,
        numberReal,
        enabled,
        appId
    }))
    // for (var i = 0; i < defaultNumbers.length; i++) {
    //     const name = defaultNumbers[i].name;
    //     const number = defaultNumbers[i].number;
    //     const [outgoing, created] = await OutgoingTable.findOrCreate({ where: { number, appId }, defaults: { name, number, numberReal, enabled, appId }, });
    //     if (!created) {
    //         await outgoing.update({ name, number, numberReal, enabled, appId });
    //     }
    // }

    await OutgoingTable.bulkCreate(defaultNumbers);
    res.json({ id: appId });

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 기본내역 불러들이기`});

    await updateNumbersForMobiles(req);

}

async function updateNumberReal(req, res, next) {
    const { number_real: numberReal } = req.body;
    const appId = req.session.app_id;

    const OutgoingTable = getOutgoingsTable(req.app.db, appId);

    await OutgoingTable.update({ numberReal }, { where: { appId } });

    const { Mobile } = req.app.db;
    const socket = req.app.socket;
    const mobiles = await Mobile.findAll({ where: { appId } });
    for (var i = 0; i < mobiles.length; i++) {
        const mobileSocket = socket.getMobileCall(mobiles[i].id);
        const room = mobileSocket != null ? mobileSocket.room : null;
        if (!room)
            continue;

        socket.io.to(room).emit(`update_number_real`, { number_real: numberReal });
    }

    res.json({ id: appId });

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 실제수신전환번호 변경: ${numberReal}`});
}

async function getOutgoing(req, res) {
    const { outgoing } = req;
    res.json({
        id: outgoing.id,
        mobile_id: outgoing.mobileId,
        name: outgoing.name,
        number: outgoing.number,
        number_real: outgoing.numberReal,
        enabled: outgoing.enabled,
    });
}

async function deleteOutgoing(req, res) {
    const id = req.outgoing.id;
    await req.outgoing.destroy();
    res.json({ "status": "success" });

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId: req.session.app_id, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 강수번호삭제 -> 삭제하는 번호: ${req.outgoing.number}`});

    const data = {
        appId: req.session.app_id,
        id
    }

    req.app.socket.io.to('mobilesCall').emit('outgoing_delete', data);
}

async function updateOutgoing(req, res, next) {
    const { outgoing } = req;
    const { name, number, number_real: numberReal, enabled, is_special } = req.body;
    const { name: originName, number: originNumber, enabled: originEnabled} = outgoing;
    const appId = req.session.app_id;
    // console.log("enabled : ", enabled == null);
    // console.log("is_special : ", is_special == null);

    if (!String(number) || !String(numberReal)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    if (enabled != null && ![true, false, 'true', 'false'].includes(enabled)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    if (is_special != null && ![true, false, 'true', 'false'].includes(is_special)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    if (enabled != null) {
        await outgoing.update({ name, number, numberReal, enabled });

        if (enabled == 'true') {
            const data = {
                appId: appId,
                id: outgoing.id,
                name,
                number,
                numberReal,
                enabled,
                is_special: outgoing.isSpecial
            }
            req.app.socket.io.to('mobilesCall').emit('outgoing_update', data);
        } else {
            const data = {
                appId: appId,
                id: outgoing.id,
            }
            req.app.socket.io.to('mobilesCall').emit('outgoing_delete', data);
        }
    } else if (is_special != null) {
        await outgoing.update({ name, number, numberReal, isSpecial: is_special });
        if (outgoing.enabled) {
            const data = {
                appId: appId,
                id: outgoing.id,
                name,
                number,
                numberReal,
                is_special: is_special,
                enabled: outgoing.enabled,
            }
            req.app.socket.io.to('mobilesCall').emit('outgoing_update', data);
        }
    }
    res.json({ id: outgoing.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 강수변경조작 -> 이름: ${originName} -> ${name}, 발신번호: ${originNumber} -> ${number}, 상태: ${originEnabled} -> ${enabled}`});
}

async function getIncomings(req, res) {
    let { limit, offset, id: mobile_id, name, number, number_real, appId } = req.query;
    const { Mobile } = req.app.db;
    const mobile = await Mobile.findByPk(mobile_id);
    if (!appId) {
        appId = req.session.app_id;
    } else {
        if (!!mobile) {
            appId = mobile.appId;
        }
    }

    const IncomingTable = getIncomingsTable(req.app.db, appId);

    if (name == null) name = '';
    if (number == null) number = '';
    if (number_real == null) number_real = '';

    let where = {
        name: {
            [Op.like]: `%${name}%`
        },
        number: {
            [Op.like]: `%${number}%`
        },
        numberReal: {
            [Op.like]: `%${number_real}%`
        },
        appId: appId
    };

    if (mobile_id) {
        where = {
            ...where,
            [Op.or]: [{ mobileId: mobile_id }, { mobileId: '' }]
        }
    }
    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);

    const results = await IncomingTable.findAndCountAll({
        where,
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ]
    });

    res.json({
        items: results.rows.map(row => ({
            id: row.id,
            mobile_id: row.mobileId,
            name: row.name,
            number: row.number,
            number_real: row.numberReal,
            enabled: row.enabled,
            updated_at: row.updatedAt
        })),
        total: results.count,
    });
}

async function addIncoming(req, res, next) {

    let { name, number, number_real: numberReal, enabled, mobile_id: mobileId } = req.body;
    const appId = req.session.app_id;

    const IncomingTable = getIncomingsTable(req.app.db, appId);

    mobileId = '';
    if (!String(name) || !String(number) || !String(numberReal)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    if (![true, false, 'true', 'false'].includes(enabled)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }

    const exist_incoming = await IncomingTable.findOne({ where: { numberReal, mobileId, appId } });
    if (!!exist_incoming) {
        return res.json({ msg: "Already exit!" });
    }

    const [incoming, created] = await IncomingTable.findOrCreate({ where: { numberReal, mobileId, appId }, defaults: { name, number, numberReal, enabled, mobileId, appId } });
    if (!created) {
        await incoming.update({ name, number, numberReal, enabled, mobileId, appId });
    }

    res.json({ id: incoming.id });

    const data = {
        appId: appId,
        id: incoming.id,
        name,
        number,
        numberReal,
        enabled
    }

    req.app.socket.io.to('mobilesCall').emit('incoming_create_one', data);

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 강발추가조작 -> 이름: ${name}, 보이는 번호: ${number}, 발신번호: ${numberReal} 상태: ${enabled}`});
}

async function getIncoming(req, res) {
    const { incoming } = req;
    res.json({
        id: incoming.id,
        mobile_id: incoming.mobileId,
        name: incoming.name,
        number: incoming.number,
        number_real: incoming.numberReal,
        enabled: incoming.enabled,
    });
}

async function deleteIncoming(req, res) {
    const id = req.incoming.id;
    const appId = req.session.app_id;
    const {name, number, numberReal, enabled} = req.incoming;
    await req.incoming.destroy();
    res.json({ status: "success" });
    const data = {
        appId: appId,
        id
    }

    req.app.socket.io.to('mobilesCall').emit('incoming_delete', data);

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 강발삭제조작 -> 이름: ${name}, 발신번호: ${numberReal}, 보이는번호: ${number}, 상태: ${enabled}`});
}

async function updateIncoming(req, res) {
    const { incoming } = req;
    const { name, number, number_real: numberReal, enabled } = req.body;
    const appId = req.session.app_id;
    if (!String(name) || !String(number) || !String(numberReal)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    if (![true, false, 'true', 'false'].includes(enabled)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }

    const { name: originName, number: originNumber, numberReal: originNumberReal, enabled: originEnabled } = incoming;

    await incoming.update({ name, number, numberReal, enabled });
    res.json({ id: incoming.id });

    if (enabled == 'true') {
        const data = {
            appId: appId,
            id: incoming.id,
            name,
            number,
            numberReal,
            enabled
        }
        req.app.socket.io.to('mobilesCall').emit('incoming_update', data);
    } else {
        const data = {
            appId: appId,
            id: incoming.id,
        }
        req.app.socket.io.to('mobilesCall').emit('incoming_delete', data);
    }

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 강발변경조작 -> 이름: ${originName} -> ${name}, 보이는 번호: ${originNumber} -> ${number}, 발신번호: ${originNumberReal} -> ${numberReal}, 상태: ${originEnabled} -> ${enabled}`});
}

async function getBlocks(req, res) {
    let { limit, offset, id: mobile_id, name, number } = req.query;
    let { appId } = req.query;
    const { Mobile } = req.app.db;
    const mobile = await Mobile.findByPk(mobile_id);
    if (!appId) {
        appId = req.session.app_id;
    } else {
        if (!!mobile) {
            appId = mobile.appId;
        }
    }

    if (name == null) name = '';
    if (number == null) number = '';

    let where = {
        name: {
            [Op.like]: `%${name}%`
        },
        number: {
            [Op.like]: `%${number}%`
        },
        appId: appId
    };

    const BlacklistTable = getBlackTable(req.app.db, appId);

    if (mobile_id) {
        where = {
            ...where,
            [Op.or]: [{ mobileId: mobile_id }, { mobileId: '' }]
        }
    }
    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);

    const results = await BlacklistTable.findAndCountAll({
        where,
        limit,
        offset,
        order: [
            ['id', 'DESC']
        ]
    });

    res.json({
        items: results.rows.map(item => ({
            id: item.id,
            mobile_id: item.mobileId,
            number: item.number,
            name: item.name,
            enabled: item.enabled,
            updated_at: item.updatedAt
        })),
        total: results.count,
    });
}

async function addBlock(req, res, next) {
    let { number, enabled, name } = req.body;
    const appId = req.session.app_id;
    const BlacklistTable = getBlackTable(req.app.db, appId);

    const mobileId = '';

    if (!name) {
        name = '';
    }
    if (!String(number)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    if (![true, false, 'true', 'false'].includes(enabled)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }

    const exist_block = await BlacklistTable.findOne({ where: { number, mobileId, appId } });
    if (!!exist_block) {
        return res.json({ msg: "Already exit!" });
    }
    const [block, created] = await BlacklistTable.findOrCreate({ where: { number, mobileId, appId }, defaults: { number, enabled, mobileId, name, appId } });
    if (!created) {
        await block.update({ number, enabled, mobileId, name, appId });
    }
    const data = {
        appId: appId,
        id: block.id,
        number,
        enabled,
        name
    }

    req.app.socket.io.to('mobilesCall').emit('block_create_one', data);

    res.json({ id: block.id });

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 블랙추가 -> 이름: ${name}, 번호: ${number}, 상태: ${enabled}`});
}

async function addBlockList(req, res, next) {
    let { number_arr, enabled, name_arr } = req.body;
    if (!name_arr || !number_arr) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    const appId = req.session.app_id;
    if (!appId) {
        return next(errcode(new Error('require login'), { status: 400 }));
    }

    const BlacklistTable = getBlackTable(req.app.db, appId);

    const mobileId = '';

    if (![true, false, 'true', 'false'].includes(enabled)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }

    for (var i = 0; i < number_arr.length; i++) {
        const exist_block = await BlacklistTable.findOne({ where: { number: number_arr[i], mobileId, appId } });
        if (!!exist_block) {
            continue;
        }
        const block = await BlacklistTable.create({
            number: number_arr[i],
            enabled,
            mobileId,
            name: name_arr[i],
            appId
        })

        const data = {
            appId: appId,
            id: block.id,
            number: number_arr[i],
            enabled,
            name: (!!name_arr[i]) ? name_arr[i] : ""
        }

        req.app.socket.io.to('mobilesCall').emit('block_create_one', data);

        const {ActionLog} = req.app.db;
        await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 연락처에서 블랙추가조작 -> 이름: ${name_arr[i]}, 번호: ${number_arr[i]} 상태: ${enabled}`});
    }
    res.json({ status: "success" });
}

async function addDefaultBlock(req, res, next) {
    const appId = req.session.app_id;
    const { BlackNumber } = req.app.db;
    const BlacklistTable = getBlackTable(req.app.db, appId);

    await BlacklistTable.destroy({ where: {}, truncate: true });

    const enabled = true;

    let defaultNumbers = await BlackNumber.findAll();

    defaultNumbers = defaultNumbers.map(blackNumber => ({
        name: blackNumber.name,
        number: blackNumber.number,
        enabled,
        appId
    }))

    // for (var i = 0; i < defaultNumbers.length; i++) {
    //     const name = defaultNumbers[i].name;
    //     const number = defaultNumbers[i].number;
    //     const [block, created] = await BlacklistTable.findOrCreate({ where: { number, appId }, defaults: { number, enabled, name, appId } });
    //     if (!created) {
    //         await block.update({ number, enabled, name, appId });
    //     }
    // }

    await BlacklistTable.bulkCreate(defaultNumbers);

    await updateNumbersForMobiles(req);

    res.json({ id: appId });

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 기본내역불러들이기`});
}

async function getBlock(req, res) {
    const { block } = req;
    res.json({
        id: block.id,
        mobile_id: block.mobileId,
        number: block.number,
        name: block.name,
        enabled: block.enabled,
    });
}

async function deleteBlock(req, res) {
    const id = req.block.id;
    const appId = req.session.app_id;
    const {name, number, enabled} = req.block;
    await req.block.destroy();
    res.json({ status: "success" });

    const data = {
        appId: appId,
        id
    }
    req.app.socket.io.to('mobilesCall').emit('block_delete', data);

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 블랙삭제조작 -> 이름: ${name}, 번호: ${number}, 상태: ${enabled}`});
}

async function updateBlock(req, res) {
    const { block } = req;
    const appId = req.session.app_id;
    let { number, enabled, name } = req.body;
    const {number: originNumber, enabled: originEnabled, name: originName} = block;

    if (!name) {
        name = '';
    }
    if (!String(number)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    if (![true, false, 'true', 'false'].includes(enabled)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }
    await block.update({ number, enabled, name });
    res.json({ id: block.id });
    if (enabled == 'true') {
        const data = {
            appId: appId,
            id: block.id,
            number,
            enabled,
            name
        };
        req.app.socket.io.to('mobilesCall').emit('block_update', data);
    } else {
        const data = {
            appId: appId,
            id: block.id,
        }
        req.app.socket.io.to('mobilesCall').emit('block_delete', data);
    }

    const {ActionLog} = req.app.db;
    await ActionLog.create({appId, content: `${req.session.type == 'user' ? '매장::' : '회원::'}${req.session.manger} -> 블랙변경조작 -> 이름: ${originName} -> ${name}, 번호: ${originNumber} -> ${number}, 상태: ${originEnabled} -> ${enabled}`});
}

async function updateNumberStatus(app, appId) {
    const { Mobile } = app.db;
    await Mobile.update({ updateNumberStatus: false }, {
        where: {
            appId
        }
    });
}

async function updateNumbersForMobiles(req) {
    const appId = req.session.app_id;
    await updateNumberStatus(req.app, appId)
    const { Mobile } = req.app.db;
    const socket = req.app.socket;
    const mobiles = await Mobile.findAll({ where: { appId: appId } });
    for (var i = 0; i < mobiles.length; i++) {
        const mobileSocket = socket.getMobileCall(mobiles[i].id);
        const room = mobileSocket != null ? mobileSocket.room : null;
        if (!room)
            continue;

        socket.io.to(room).emit(`update_numbers`);
    }
}

async function getNumberReal(req, res) {
    const { appId } = req.query;
    const { User } = req.app.db;
    if(typeof(appId) == 'undefined')
        return res.status(404).json({err: 'parameter is not correct!'});
    const user = await User.findOne({ where: { appId } });
    if (!!user) {
        return res.json({
            number_real: user.numberReal
        })
    } else {
        const admin_user = await User.findOne({ where: { appId: "chongpan" } });
        return res.json({
            number_real: admin_user.numberReal
        })
    }
}

async function updateNumberDB(req, res) {
    const { mobile_id } = req.body;
    const { Mobile } = req.app.db;
    const mobile = await Mobile.findByPk(mobile_id);
    if (!mobile) {
        return res.json({
            status: "error",
            msg: "기기를 찾을수 없습니다."
        })
    }
    const socket = req.app.socket;
    const mobileSocket = socket.getMobileCall(mobile_id);
    const room = mobileSocket != null ? mobileSocket.room : null;
    if (!room) {
        return res.json({
            status: "error",
            msg: "기기와 통신할수 없습니다."
        })
    }
    await mobile.update({ updateNumberStatus: false });
    socket.io.to(room).emit(`update_numbers`);
    res.json({
        status: "success"
    })
}

function saveUploadNumberFile() {
    const storage = multer.diskStorage({
        destination(req, file, cb) {
            const dir = req.app.get('number_file.dir');
            mkdirp.sync(dir);
            cb(null, dir);
        },
        filename(req, file, cb) {
            var originalname = file.originalname;
            var extention = originalname.substr(originalname.lastIndexOf("."));
            var new_file_name = Date.now() + extention;
            req.body.file_name = new_file_name;
            return cb(null, new_file_name);
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

async function xlsxParse(file, appId, numberReal, enabled) {

    var obj = xlsx.parse(fs.readFileSync(file)); // parses a buffer
    const data = obj[0].data;

    const defaultNumbers = [];

    for (var i = 1; i < data.length; i++) {
        // console.log(data[i][0], "   :   ", data[i][1]);
        defaultNumbers.push(
            {
                name: data[i][0],
                number: data[i][1],
                numberReal,
                enabled,
                appId
            })
    }
    console.log(" total : ", data.length, "개");
    return defaultNumbers;
}

async function uploadNumberFile(req, res) {
    const { file_name } = req.body;
    const dir = req.app.get('number_file.dir');
    const number_file = path.resolve(process.cwd(), `${dir}/${file_name}`);

    const appId = req.session.app_id;
    const enabled = true;
    const numberReal = req.session.number_real;

    const defaultNumbers = await xlsxParse(number_file, appId, numberReal, enabled);
    const OutgoingTable = getOutgoingsTable(req.app.db, appId);

    await OutgoingTable.bulkCreate(defaultNumbers);

    await updateNumbersForMobiles(req);
    res.json({ status: 1 });
}

module.exports = app => {

    // 강제 수신 번호
    app.api.route('/numbers/outgoing_redirection_list')
        .get(getOutgoings)//requireLogin(),
        .post(requireLogin(), addOutgoing);
    app.api.route('/numbers/outgoing_redirection_lists')
        .post(requireLogin(), addOutgoingList);
    app.api.route('/numbers/outgoing_redirection_list/default')
        .post(requireLogin(), addDefaultOutgoing);
    app.api.route('/numbers/outgoing_redirection_list/number_real')
        .post(requireLogin(), updateNumberReal);

    app.api.route('/numbers/outgoing_redirection_list/:outgoing')
        .get(requireLogin(), getOutgoing)
        .put(requireLogin(), updateOutgoing)
        .delete(requireLogin(), deleteOutgoing);

    app.api.route('/numbers/get_number_real')
        .get(getNumberReal);

    // 강제 발신 번호
    app.api.route('/numbers/incoming_redirection_list')
        .get(getIncomings)//requireLogin(), 
        .post(requireLogin(), addIncoming);
    app.api.route('/numbers/incoming_redirection_list/:incoming')
        .get(requireLogin(), getIncoming)
        .delete(requireLogin(), deleteIncoming)
        .put(requireLogin(), updateIncoming);

    // 블랙 목록
    app.api.route('/numbers/blacklist')
        .get(getBlocks)  // requireLogin()
        .post(requireLogin(), addBlock);
    app.api.route('/numbers/blacklists')
        .post(requireLogin(), addBlockList);
    app.api.route('/numbers/blacklist/default')
        .post(requireLogin(), addDefaultBlock);
    app.api.route('/numbers/blacklist/:block')
        .get(requireLogin(), getBlock)
        .put(requireLogin(), updateBlock)
        .delete(requireLogin(), deleteBlock);

    app.api.route('/numbers/update_number_db').post(requireLogin(), updateNumberDB);

    // 파일에 의한 강수 목록 불러들이기 API
    app.api.route('/numbers/upload_number_file').post(requireLogin(), saveUploadNumberFile(), uploadNumberFile);
};