require('rootpath')();

const requireRole = require('middlewares/require_role');
const requireLogin = require('middlewares/require_login');

async function getMembers(req, res) {
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
    const { Member } = req.app.db;
    const members = await Member.findAndCountAll({
        where, offset, limit
    });

    res.json({
        items: members.rows.map(item => ({
            id: item.id,
            username: item.username,
            password_str: item.passwordStr,
            loginid: item.loginid,
            roles: item.roles,
            app_id: item.appId,
            address: item.address,
        })),
        total: members.count,
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
    let { username, loginid, password, roles, app_id: appId, address } = req.body;
    const { Member } = req.app.db;
    if(await Member.count({where: {loginid}}) > 0) 
        return res.status(400).json({ msg: 'loginid already exist'});
    
    let t = await req.app.db.sequelize.transaction();
    const user = await Member.create({ username, loginid, password, passwordStr: password, roles, appId, address }, { transaction: t });
    await t.commit();
    return res.json({ id: user.id });
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