module.exports = () => {
    return async (req, res, next) => {
        const username = req.session.manger;
        const user_id = req.session.manger_id;
        if (!!username && !!user_id) {
            const {
                User,
                Member,
                AppId,
                Avatar
            } = req.app.db;
            let app_id = "";
            const user = await User.findByPk(user_id);
            const member = await Member.findByPk(user_id);
            if (req.session.type == "user") {
                if (!user) {
                    delete req.session.manger;
                    delete req.session.manger_id;
                    delete req.session.app_id;
                    delete req.session.number_real;
                    delete req.session.type;
                    return res.redirect(`/user/login`);
                }
                app_id = user.appId;
            } else if (req.session.type == "member") {
                if (!member) {
                    delete req.session.manger;
                    delete req.session.manger_id;
                    delete req.session.app_id;
                    delete req.session.number_real;
                    delete req.session.type;
                    return res.redirect(`/user/login`);
                }
                app_id = member.appId;
            } else {
                delete req.session.manger;
                delete req.session.manger_id;
                delete req.session.app_id;
                delete req.session.number_real;
                delete req.session.type
                return res.redirect(`/user/login`);
            }
            const avatar = await Avatar.findOne({
                where: {
                    appId: app_id
                }
            });

            if(req.session.type == "member") {
                const member_user = await User.findOne({ where: { appId: member.appId } });
                member.expiredDay = member_user.expiredDay;
            }

            req.currentUser = res.locals.user = (req.session.type == "user") ? user : member;
            if (!!avatar) {
                res.locals.avatar = avatar;
            }
            res.locals.naver_map_client_id = process.env.NAVERMAP_CLIENT_ID || "";
        }
        next();
    }
};