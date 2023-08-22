require('rootpath')();

const path = require('path');
const errcode = require('err-code');
const multer = require('multer');
const mkdirp = require('mkdirp');
const { Op } = require('sequelize');
const requireLogin = require('middlewares/require_login');

async function addAttendance(req, res) {
    var mobileId = String(req.body.id);
    const appId = String(req.body.appId);
    const nickname = String(req.body.nickname);
    const phone = String(req.body.phone);
    const startTime = String(req.body.start_time);
    const endTime = String(req.body.end_time);
    const address = String(req.body.address);
    const { Attendance } = req.app.db;

    const [attendance, created] = await Attendance.findOrCreate({ where: { mobileId }, defaults: { mobileId, nickname, phone, startTime, endTime, address, appId } });
    if (!created) {
        await attendance.update({ mobileId, nickname, phone, startTime, endTime, address, appId });
    }
    res.json({ id: attendance.id });

    req.app.socket.io.to('controls').emit('attendance_updated');
}

async function getAttendances(req, res) {
    let { offset, limit, mobile_id, search } = req.query;
    const appId = req.session.app_id;

    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);
    if (search == null) search = '';

    let where = {};
    if (appId != "chongpan" && appId != "super") {
        where.appId = appId;
    } else if (appId == "chongpan") {
        where.appId = {
            [Op.ne]: "super"
        }
    }

    if (search !== '') {
        where.nickname = {
            [Op.like]: `%${search}%`
        }
    }

    if (mobile_id) {
        where = {
            ...where,
            mobileId: mobile_id
        }
    }
    const { Attendance, Mobile } = req.app.db;

    const attendances = await Attendance.findAndCountAll({
        where,
        offset,
        limit,
        include: [Mobile],
        order: [
            ['id', 'DESC']
        ]
    });

    res.json({
        items: attendances.rows.map(attendance => ({
            id: attendance.id,
            mobile_id: attendance.mobileId,
            mobile_number: attendance.mobile ? attendance.mobile.number : '',
            phone: attendance.phone,
            nickname: attendance.nickname,
            start_time: attendance.startTime,
            end_time: attendance.endTime,
            address: attendance.address,
            timestamp: attendance.createdAt,
        })),
        total: attendances.count,
    });
}

async function getAttendance(req, res) {
    const { attendance } = req;
    res.json({
        mobile_number: attendance.mobile ? attendance.mobile.number : '',
        nickname: attendance.nickname,
        phone: attendance.phone,
        start_time: attendance.startTime,
        end_time: attendance.endTime,
        address: attendance.address,
        timestamp: attendance.createdAt,
    });
}

async function getAttendanceByMobileId(req, res, next) {
    const { mobile_id: mobileId } = req.query;
    const { Attendance, Mobile } = req.app.db;
    const attendance = await Attendance.findOne({ where: { mobileId }, include: [Mobile] });
    if (!attendance)
        return next(errcode(new Error('not found'), { status: 404 }));

    res.json({
        mobile_number: attendance.mobile ? attendance.mobile.number : '',
        phone: attendance.phone,
        nickname: attendance.nickname,
        start_time: attendance.startTime,
        end_time: attendance.endTime,
        address: attendance.address,
        timestamp: attendance.createdAt,
    });
}

async function deleteAttendance(req, res) {
    await req.attendance.destroy();
    res.json({});
}

module.exports = app => {

    app.api.route('/mobile/attendance')
        .post(addAttendance);

    app.api.route('/attendances')
        .get(requireLogin(), getAttendances);
    app.api.route('/attendance/get_by_mobileid')
        .get(getAttendanceByMobileId);
    app.api.route('/attendances/:attendance')
        .get(getAttendance)
        .delete(deleteAttendance);
};