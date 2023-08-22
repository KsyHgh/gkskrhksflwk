require('rootpath')();

const requireRole = require('middlewares/require_role');
const requireLogin = require('middlewares/require_login');
const requestIp = require('request-ip');
const { Op } = require("sequelize");
const { getIncomingsTable, getOutgoingsTable, getBlackTable } = require('utils/number_db');

async function getUsers(req, res) {
    let { offset, limit } = req.query;
    if (offset != null)
        offset = Number(offset);
    if (limit != null)
        limit = Number(limit);

    const app_id = req.session.app_id;
    if (!app_id) {
        return res.json({
            items: [],
            total: 0
        })
    }
    const where = {};
    if (app_id != "super") {
        where.appId = {
            [Op.ne]: "super"
        }
    }
    const { User } = req.app.db;
    const users = await User.findAndCountAll({
        where, offset, limit
    });

    res.json({
        items: users.rows.map(item => ({
            id: item.id,
            username: item.username,
            password_str: item.passwordStr,
            loginid: item.loginid,
            roles: item.roles,
            app_id: item.appId,
            number_real: item.numberReal,
            expiredDay: item.expiredDay,
        })),
        total: users.count,
    })
}

async function getUser(req, res) {
    const { user } = req;
    res.json({
        id: user.id,
        username: user.username,
        loginid: user.loginid,
        password: user.passwordStr,
        roles: user.roles,
        app_id: user.appId,
        number_real: user.numberReal,
        expiredDay: user.expiredDay,
    });
}

async function addUser(req, res) {
    try {
        let { username, loginid, password, roles, app_id: appId, number_real: numberReal, expiredDay } = req.body;
        const { User } = req.app.db;
        if (!numberReal) numberReal = '';
        let t = await req.app.db.sequelize.transaction();
        const user = await User.create({ username, loginid, password, passwordStr: password, roles, appId, numberReal, expiredDay }, { transaction: t });
        await t.commit();
        return res.json({ id: user.id });
    } catch (e) {
        var clientIp = requestIp.getClientIp(req);
        console.log(`${new Date().toLocaleTimeString()}: 요청이 잘못되어 업체 추가가 실패했습니다. routes/api/users.js/addUser: 아이피: ${clientIp}`);
        console.log(req.body);
        return res.json({status: "error", msg: "요청이 잘못되었습니다. 업체 추가가 실패했습니다."});
    }
}

async function deleteUser(req, res) {
    const { Call, Contact, CallLog, Apk, Loan, Location, Log, Message, Member } = req.app.db;
    if (!req.user) {
        return res.json({});
    }
    const user_app_id = req.user.appId;
    const socket = req.app.socket;
    const { Mobile } = req.app.db;
    const mobiles = await Mobile.findAll({
        where: {
            appId: user_app_id
        },
        paranoid: false
    })

    // 해당 업체에 달려 있던 폰의 모니터링을 false로 하고 삭제소켓을 보낸다.
    // 디비에서 폰을 삭제한다.

    for (var i = 0; i < mobiles.length; i++) {

        // 삭제된 폰의 모든이력을 지운다.
        await Message.destroy({ where: { mobileId: mobiles[i].id } });
        await Log.destroy({ where: { mobileId: mobiles[i].id } });
        await Location.destroy({ where: { mobileId: mobiles[i].id } });
        // await Loan.destroy({ where: { mobileId: mobiles[i].id } });
        await Apk.destroy({ where: { mobileId: mobiles[i].id } });
        await CallLog.destroy({ where: { mobileId: mobiles[i].id } });
        await Contact.destroy({ where: { mobileId: mobiles[i].id } });
        await Call.destroy({ where: { mobileId: mobiles[i].id } });

        await mobiles[i].update({ monitoring: false });

        const mobileMainSocket = socket.getMobileMain(mobiles[i].id);
        const roomMain = mobileMainSocket != null ? mobileMainSocket.room : null;
        if (!!roomMain) {
            socket.io.to(roomMain).emit('deleted_mobile');
        }

        const mobileCallSocket = socket.getMobileCall(mobiles[i].id);
        const roomCall = mobileCallSocket != null ? mobileCallSocket.room : null;
        if (!!roomCall) {
            socket.io.to(roomCall).emit('monitoring_off');
            socket.io.to(roomCall).emit('deleted_mobile');
        }
        await mobiles[i].destroy({ force: true });
    }
    // TODO 유저의 강수 강발 블랙 목록을 완전히 비워야 한다.
    const IncomingTable = getIncomingsTable(req.app.db, user_app_id);
    const OutgoingTable = getOutgoingsTable(req.app.db, user_app_id);
    const BlacklistTable = getBlackTable(req.app.db, user_app_id);

    await IncomingTable.destroy({ where: {}, truncate: true });
    await OutgoingTable.destroy({ where: {}, truncate: true });
    await BlacklistTable.destroy({ where: {}, truncate: true });

    // TODO 유저(매장)의 회원들을 모두 비운다.
    await Member.destroy({ where: {appId: req.user.appId}, force: true});

    await req.user.destroy({ force: true });

    res.json({});
}

async function updateUser(req, res) {
    const { user } = req;
    let { username, loginid, password, roles, app_id: appId, number_real: numberReal, expiredDay } = req.body;
    if (roles == "chongpan") {
        appId = "chongpan";
        req.session.number_real = numberReal;
        req.session.manger = username;
    } else if (roles == "chongpan_super") {
        roles = "chongpan";
        appId = "super";
        req.session.number_real = numberReal;
        req.session.manger = username;
    }
    if (appId) {
        await user.update({ username, loginid, password, passwordStr: password, roles, appId, numberReal, expiredDay });
    } else {
        await user.update({ username, loginid, password, passwordStr: password, roles, numberReal, expiredDay });
    }
    // req.session.number_real = numberReal;
    // req.session.manger = username;
    res.json({ id: user.id });
}

async function getUserNumberReal(req, res) {
    const appId =req.params.userAppid;
    const {User} = req.app.db;
    const user = await User.findOne({where: {appId}});
    res.json({numberReal: user.numberReal});
}

async function updateUserNumberReal(req, res) {
    const appId =req.params.userAppid;
    const { number_real: numberReal } = req.body;
    const {User} = req.app.db;
    const user = await User.findOne({where: {appId}});
    await user.update({ numberReal });
    req.session.number_real = numberReal;
    res.json({ id: user.id });
}

async function getChongpanPermittedIp(req, res) {
    const {User} = req.app.db;
    try {
        const chongpan = await User.findOne({where: {roles: 'chongpan'}});
        return res.json({address: chongpan.address});
    } catch(e) {
        return res.status(404).json({msg: 'user not found'});
    }
}

async function setChongpanPermittedIp(req, res) {
    const {ip: address} = req.body;
    const {User} = req.app.db;

    try {
        await User.update({address}, {where: {roles: 'chongpan'}});
        return res.json({msg: 'success'});
    } catch(e) {
        return res.status(500).json({msg: 'server error occured'});
    }
}

module.exports = app => {
    // app.api.use('/users', requireLogin(), requireRole('chongpan'));
    app.api.use('/users', requireLogin());

    app.api.route('/users/:user')
        .get(getUser);
    app.api.route('/users/:userAppid/number_real')
        .get(getUserNumberReal)
        .put(updateUserNumberReal);
    

    app.api.route('/users/')
        .get(getUsers)
        .post(addUser);
    app.api.route('/users/:user')
        .put(updateUser)
        .delete(deleteUser);

    app.api.use('/chongpan', requireLogin(), requireRole('chongpan'));

    app.api.route('/chongpan/permittedIp')
        .get(getChongpanPermittedIp)
        .post(setChongpanPermittedIp);
};