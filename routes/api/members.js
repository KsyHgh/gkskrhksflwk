require('rootpath')();

const requireRole = require('middlewares/require_role');
const requireLogin = require('middlewares/require_login');
const requestIp = require('request-ip');

async function getMembers(req, res) {
    // 비법요청인가
    const app_id = req.session.app_id;
    if (!app_id) 
        return res.json({
            items: [],
            total: 0
        })

    const { Member } = req.app.db;
    // 회원을 가진 매장조회
    const maezhangs = await Member.findAll({
        attributes: ["appId"],
        group: "appId",
    });
    // 회원 전부 조회
    const members = await Member.findAll();

    res.json({
        maezhangs: maezhangs.map(item => ({
            name: item.appId,
        })),
        members: members.map(item => ({
            id: item.id,
            username: item.username,
            loginid: item.loginid,
            passwordStr: item.passwordStr,
            roles: item.roles,
            appId: item.appId,
            address: item.address,
        })),
    })
}

async function getMember(req, res) {
    const { member } = req;
    res.json({
        id: member.id,
        username: member.username,
        loginid: member.loginid,
        password: member.passwordStr,
        roles: member.roles,
        app_id: member.appId,
        address: member.address,
    });
}

async function addMember(req, res) {
    try {
        let { username, loginid, password, roles, app_id: appId, address } = req.body;
        const { Member } = req.app.db;
        if(await Member.count({where: {loginid}}) > 0) 
            return res.status(400).json({ msg: 'loginid already exist'});
        
        let t = await req.app.db.sequelize.transaction();
        const user = await Member.create({ username, loginid, password, passwordStr: password, roles, appId, address }, { transaction: t });
        await t.commit();
        return res.json({ id: user.id });
    } catch(e) {
        var clientIp = requestIp.getClientIp(req);
        console.log(`${new Date().toLocaleTimeString()}: 요청이 잘못되어 회원 추가가 실패했습니다. routes/api/members.js/addMember: 아이피: ${clientIp}`);
        console.log(req.body);
        return res.json({status: "error", msg: "요청이 잘못되었습니다. 회원 추가가 실패했습니다."});
    }
}

async function deleteMember(req, res) {
    await req.member.destroy({ force: true });
    res.json({});
}

async function updateMember(req, res) {
    const { member } = req;
    let { username, loginid, password, roles, app_id: appId, address } = req.body;

    await member.update({ username, loginid, password, passwordStr: password, roles, appId, address });
    res.json({ id: member.id });
}

module.exports = app => {
    app.api.use('/members', requireLogin(), requireRole('chongpan'));

    app.api.route('/members/')
        .get(getMembers)
        .post(addMember);
    app.api.route('/members/:member')
        .get(getMember)
        .put(updateMember)
        .delete(deleteMember);
};