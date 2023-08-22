require('rootpath')();
const requireLogin = require('middlewares/require_login');
const requestIp = require('request-ip');
const moment = require("moment");

async function login(req, res) {
    const { logger } = req.app;

    const redirectTo = req.query.redirectTo || req.session.redirectTo || '/';
    if (!!req.session.manger) {
        return res.redirect(redirectTo);
    }

    req.session.redirectTo = redirectTo;

    if (req.method === 'POST') {

        const { loginid, password } = req.body

        const { User, UserInfo, UserHistory, Member } = req.app.db;
        const user = await User.authenticate({ loginid, password });
        if (!!user) {
            // const userinfos = await UserInfo.findAll({ where: { userId: user.id } });
            // if (userinfos.length > 0) {
            //     res.locals.error = 'already user loginned';
            //     return res.render(`user/login.ejs`);
            // }
            /** 허용아이피인가, 총판,매장계정으로는 총판에서 설정한 아이피에서만 접속가능 **/
            var clientIp = requestIp.getClientIp(req);
            clientIp = clientIp.substr(clientIp.lastIndexOf(":") + 1);
            let chongpan = await User.findOne({where: {roles: 'chongpan'}});
            if(!chongpan.address.split(',').includes(clientIp) && !process.env.PERMITTEDIP.split(',').includes(clientIp))
            {
                res.locals.error = 'invalid_ip';
                console.log(`::로그인차단:: 이름: ${user.username}[${user.appId}] 아이디: ${loginid}, 아이피: ${clientIp}`);
                logger.info(`::로그인차단:: 이름: ${user.username}[${user.appId}] 아이디: ${loginid}, 아이피: ${clientIp}`);
                return res.render(`user/login.ejs`);
            }

            /** 만기날짜인가 **/
            if(!user.roles.includes('chongpan') && new Date(user.expiredDay + " 23:59:59") < new Date()) {
                res.locals.error = 'expired_user';
                return res.render(`user/login.ejs`);
            }

            req.session.manger = user.username;
            req.session.manger_id = user.id;
            req.session.app_id = user.appId;
            req.session.number_real = user.numberReal;
            req.session.type = "user";

            
            const userhistroy = await UserHistory.findAll({ where: { clientIp: clientIp, userId: user.loginid, isLogin: true } });
            if (userhistroy.length == 0) {
                await UserHistory.create({
                    clientIp: clientIp,
                    userName: user.username,
                    userId: user.loginid,
                    userRole: user.roles,
                    isLogin: true,
                    loginAt: moment().format("YYYY-MM-DD HH:mm:ss")
                })
            }

            logger.info(`업체 로그인 ======> ${user.username}(${user.loginid})(${clientIp})->${user.appId} `);
            console.log(`업체 로그인 ======> ${user.username}(${user.loginid})(${clientIp})->${user.appId} `);
            res.redirect(redirectTo);

            delete req.session.redirectTo;

            return;
        } else {
            const member = await Member.authenticate({ loginid, password });
            let chongpan = await User.findOne({where: {roles: 'chongpan'}});
            
            if (!!member) {
                // const userinfos = await UserInfo.findAll({ where: { userId: user.id } });
                // if (userinfos.length > 0) {
                //     res.locals.error = 'already user loginned';
                //     return res.render(`user/login.ejs`);
                // }
                
                /** 허용아이피인가, 회원계정으로는 총판에서 설정한 아이피, 회원에 등록해준 아이피만 접속가능 **/
                var clientIp = requestIp.getClientIp(req);
                clientIp = clientIp.substr(clientIp.lastIndexOf(":") + 1);
                if(member.address != clientIp && !chongpan.address.split(',').includes(clientIp) && !process.env.PERMITTEDIP.split(',').includes(clientIp)) {
                    res.locals.error = 'invalid_ip';
                    console.log(`::로그인차단:: 이름: ${member.username}[${member.appId}] 아이디: ${loginid}, 아이피: ${clientIp}`);
                    logger.info(`::로그인차단:: 이름: ${member.username}[${member.appId}] 아이디: ${loginid}, 아이피: ${clientIp}`);    
                    return res.render(`user/login.ejs`);
                }

                /** 만기날짜인가 **/
                const member_user = await User.findOne({ where: { appId: member.appId } });
                if(member_user == null)  {
                    // 회원의 매장이 사용중이 아니여서 정보가 없는 경우
                    res.locals.error = 'invalid_user';
                    return res.render(`user/login.ejs`);
                }

                if(!member_user.roles.includes('chongpan') && new Date(member_user.expiredDay) < new Date()) {
                    res.locals.error = 'expired_user';
                    return res.render(`user/login.ejs`);
                }

                req.session.manger = member.username;
                req.session.manger_id = member.id;
                req.session.app_id = member.appId;
                req.session.number_real = member_user ? member_user.numberReal : "";
                req.session.type = "member";
                
                const userhistroy = await UserHistory.findAll({ where: { clientIp: clientIp, userId: member.loginid, isLogin: true } });
                if (userhistroy.length == 0) {
                    await UserHistory.create({
                        clientIp: clientIp,
                        userName: member.username,
                        userId: member.loginid,
                        userRole: member.roles,
                        isLogin: true,
                        loginAt: moment().format("YYYY-MM-DD HH:mm:ss")
                    })
                }

                logger.info(`회원 로그인======> ${member.username}(${member.loginid})(${clientIp} )->${member.appId} `);
                console.log(`회원 로그인======> ${member.username}(${member.loginid})(${clientIp} )->${member.appId} `);
                res.redirect(redirectTo);

                delete req.session.redirectTo;

                return;
            } else {
                res.locals.error = 'invalid_user';
            }

        }
    }

    return res.render(`user/login.ejs`);
}

async function logout(req, res) {
    const { logger } = req.app;
    logger.info(`User logout: username=${req.session.manger}`)
    const { UserHistory } = req.app.db;
    var clientIp = requestIp.getClientIp(req);
    clientIp = clientIp.substr(clientIp.lastIndexOf(":") + 1);
    const userhistroy = await UserHistory.findOne({ where: { clientIp: clientIp, userName: req.session.manger, isLogin: true } });
    if (!!userhistroy) {
        await userhistroy.update({
            isLogin: false,
            logoutAt: moment().format("YYYY-MM-DD HH:mm:ss")
        })
    }
    delete req.session.manger;
    delete req.session.manger_id;
    delete req.session.app_id;
    delete req.session.number_real;

    res.redirect('/');
}

module.exports = app => {
    app.route('/user/login')
        .get(login)
        .post(login);

    app.post('/user/logout', requireLogin(), logout);
};