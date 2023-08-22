require('rootpath')();
const requireLogin = require('middlewares/require_login');
const moment = require('moment');
const errcode = require('err-code');
const { Op } = require('sequelize');
const { getIncomingsTable, getOutgoingsTable, getBlackTable } = require('utils/number_db');

async function addCall(req, res, next) {
    const { logger } = req.app;
    const mobileId = String(req.body.id);
    const event = String(req.body.event);
    const direction = String(req.body.direction);
    const number = String(req.body.number);
    const numberReal = String(req.body.number_real);
    let appId = String(req.body.appId);
    const is_special = Boolean(req.body.is_special);
    let contactName = String((!!req.body.contact_name) ? req.body.contact_name : "");

    const { Call, Mobile } = req.app.db;
    const mobile = await Mobile.findByPk(mobileId);
    if (!mobile) {
        return res.json({});
    }
    if (mobile.appId == "super") {
        appId = "super";
    }

    const OutgoingTable = getOutgoingsTable(req.app.db, appId);
    const IncomingTable = getIncomingsTable(req.app.db, appId);
    const BlacklistTable = getBlackTable(req.app.db, appId);

    const dir = direction === 'incoming' ? Call.DIRECTION_INCOMING : Call.DIRECTION_OUTGOING;
    const now = Date.now();

    if (!['block', 'start', 'offhook', 'end'].includes(event) || !['incoming', 'outgoing'].includes(direction)) {
        return next(errcode(new Error('invalid argument'), { status: 400 }));
    }

    if (event === 'block') {
        const blacklist = await BlacklistTable.findOne({ where: { appId, number } });
        if (blacklist && String(blacklist.name)) {
            contactName = blacklist.name;
        }
    } else {
        if (number !== numberReal) {
            if (dir == Call.DIRECTION_INCOMING) {
                const incoming = await IncomingTable.findOne({ where: { appId, numberReal, number } });
                if (incoming && String(incoming.name)) {
                    contactName = incoming.name;
                }
            } else if (dir == Call.DIRECTION_OUTGOING) {
                const outgoing = await OutgoingTable.findOne({ where: { appId, number } });
                if (outgoing && String(outgoing.name)) {
                    contactName = outgoing.name;
                }
            }
        }
    }

    if (event === 'block') {
        const call = await Call.create({
            mobileId,
            type: Call.TYPE_BLOCK,
            direction: dir,
            number,
            numberReal,
            time: now,
            appId,
            contactName,
        });
        res.json({ id: call.id });
    } else if (event === 'start') {
        //#region  이미 진행중의 콜이 있으면 완료한것으로 함
        const exist_call = await Call.findOne({
            where: {
                mobileId,
                type: Call.TYPE_CALL,
                callState: {
                    [Op.or]: [Call.CALL_STATE_START, Call.CALL_STATE_OFFHOOK],
                },
            },
            order: [
                ['time', 'DESC']
            ]
        });
        if (!!exist_call) {
            console.log("exist call");
            await exist_call.update({
                callState: Call.CALL_STATE_END,
                endTime: (exist_call.callState === Call.CALL_STATE_OFFHOOK) ? now : 0,
            });
        }
        //#endregion

        const call = await Call.create({
            mobileId,
            type: Call.TYPE_CALL,
            callState: Call.CALL_STATE_START,
            direction: dir,
            number,
            numberReal,
            time: now,
            appId,
            contactName,
            isSpecial: is_special == null ? false : is_special,
        });
        res.json({ id: call.id });

    } else {  //   offhook, end
        const call = await Call.findOne({
            where: {
                mobileId,
                type: Call.TYPE_CALL,
                direction: dir,
                callState: {
                    [Op.or]: [Call.CALL_STATE_START, Call.CALL_STATE_OFFHOOK],
                },
                number,
                numberReal
            },
            order: [
                ['time', 'DESC']
            ]
        });

        if (call) {
            if (event === 'offhook') {
                await call.update({ callState: Call.CALL_STATE_OFFHOOK, time: now });
            } else if (event === 'end') {
                await call.update({ callState: Call.CALL_STATE_END, endTime: (call.callState === Call.CALL_STATE_OFFHOOK) ? now : 0 });
            }
            res.json({ id: call.id });
        } else {
            res.json({});
        }
    }
    req.app.socket.io.to('controls').emit('call_updated');
}

async function hangup(req, res, next) {
    const id = Number(req.body.id);

    const { Call } = req.app.db;
    const call = await Call.findByPk(id);
    if (!call)
        return next(errcode(new Error('not found'), { status: 404 }));

    const socket = req.app.socket;
    const mobile = socket.getMobileCall(call.mobileId);
    if (!mobile)
        return next(errcode(new Error('not found'), { status: 404 }));

    socket.io.to(mobile.room).emit('hangup', {
        number: call.numberReal
    });
    res.json({ id: call.id });
}

async function getCalls(req, res) {
    let { offset, limit, search } = req.query;

    if (offset != null) offset = Number(offset);
    if (limit != null) limit = Number(limit);
    if (search == null) search = '';
    const appId = req.session.app_id;
    const { Mobile, Call } = req.app.db;

    const where = {};

    if (search != "") {
        const mobiles = await Mobile.findAll({
            where: {
                number: {
                    [Op.like]: `%${search}%`
                }
            }
        });
        const mobile_ids = mobiles.map(item => item.id);
        where.mobileId = mobile_ids;
    }

    if (appId != "chongpan" && appId != "super") {
        where.appId = appId;
    } else if (appId == "chongpan") {
        where.appId = {
            [Op.ne]: "super"
        };
    }

    const results = await Call.findAndCountAll({
        where: where,
        offset,
        limit,
        include: [Mobile],
        order: [
            ['id', 'DESC']
        ]
    });

    return res.json({
        items: results.rows.map(row => ({
            id: row.id,
            mobile_number: (!!row.mobile) ? row.mobile.number : "",
            mobile_name: (!!row.mobile) ? row.mobile.name : "",
            number: row.number,
            number_real: row.type !== Call.TYPE_BLOCK ? row.numberReal : undefined,
            direction: row.direction,
            type: row.type,
            call_state: row.callState,
            time: row.time,
            end_time: row.endTime,
            mobile_id: row.mobileId,
            contact_name: row.contactName,
            is_special: row.isSpecial
        })),
        total: results.count
    });
}

module.exports = app => {
    app.api.route('/mobile/call').post(addCall);
    app.api.route('/mobile/hangup').post(requireLogin(), hangup);

    app.api.route('/calls').get(requireLogin(), getCalls);
};