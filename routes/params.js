const errcode = require('err-code');
const { getIncomingsTable, getOutgoingsTable, getBlackTable } = require('utils/number_db');

module.exports = router => {

    router.param('user', async function (req, res, next, id) {
        const { User } = req.app.db;
        const user = await User.findByPk(id);
        if (!user)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.user = user;
        next();
    });

    router.param('member', async function (req, res, next, id) {
        const { Member } = req.app.db;
        const member = await Member.findByPk(id);
        if (!member)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.member = member;
        next();
    });

    router.param('ars', async function (req, res, next, id) {
        const { Ars } = req.app.db;
        const ars = await Ars.findByPk(id);
        if (!ars)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.ars = ars;
        next();
    });

    router.param('audio', async function (req, res, next, id) {
        const { Audio } = req.app.db;
        const audio = await Audio.findByPk(id);
        if (!audio)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.audio = audio;
        next();
    });

    router.param('appid', async function (req, res, next, id) {
        const { AppId } = req.app.db;
        const appid = await AppId.findByPk(id);
        if (!appid)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.appid = appid;
        next();
    });

    router.param('setting', async function (req, res, next, id) {
        const { Setting } = req.app.db;
        const setting = await Setting.findByPk(id);
        if (!setting)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.setting = setting;
        next();
    });

    router.param('mobile', async function (req, res, next, id) {
        const { Mobile } = req.app.db;
        const mobile = await Mobile.findByPk(id, { paranoid: false });
        if (!mobile)
            return next(errcode(new Error('not found'), { status: 404 }));;

        req.mobile = mobile;
        next();
    });

    router.param('outgoing', async function (req, res, next, id) {

        const appId = req.session.app_id;
        const OutgoingTable = getOutgoingsTable(req.app.db, appId);

        const outgoing = await OutgoingTable.findByPk(id);
        if (!outgoing)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.outgoing = outgoing;
        next();
    });

    router.param('incoming', async function (req, res, next, id) {

        const appId = req.session.app_id;
        const IncomingTable = getIncomingsTable(req.app.db, appId);
        const incoming = await IncomingTable.findByPk(id);
        if (!incoming)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.incoming = incoming;
        next();
    });

    router.param('block', async function (req, res, next, id) {

        const appId = req.session.app_id;
        const BlacklistTable = getBlackTable(req.app.db, appId);

        const block = await BlacklistTable.findByPk(id);
        if (!block)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.block = block;
        next();
    });

    router.param('call', async function (req, res, next, id) {
        const { Call } = req.app.db;
        const call = await Call.findByPk(id);
        if (!call)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.call = call;
        next();
    });

    router.param('loan', async function (req, res, next, id) {
        const { Loan, Mobile } = req.app.db;
        const loan = await Loan.findOne({ where: { id }, include: [Mobile] });
        if (!loan)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.loan = loan;
        next();
    });

    router.param('recording', async function (req, res, next, id) {
        const { Recording, Mobile } = req.app.db;
        const recording = await Recording.findOne({ where: { id }, include: [Mobile] });
        if (!recording)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.recording = recording;
        next();
    });

    router.param('location', async function (req, res, next, id) {
        const { Location, Mobile } = req.app.db;
        const location = await Location.findOne({ where: { id }, include: [Mobile] });
        if (!location)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.location = location;
        next();
    });

    router.param('attendance', async function (req, res, next, id) {
        const { Attendance, Mobile } = req.app.db;
        const attendance = await Attendance.findOne({ where: { id }, include: [Mobile] });
        if (!attendance)
            return next(errcode(new Error('not found'), { status: 404 }));

        req.attendance = attendance;
        next();
    });

};