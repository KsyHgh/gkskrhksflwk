const requestIp = require('request-ip');

module.exports = (options = {}) => {
    options = { loginUrl: `/user/login`, ...options };

    return async (req, res, next) => {

        if (req.session.manger && req.session.app_id) {
            const { UserHistory } = req.app.db;
            var clientIp = requestIp.getClientIp(req);
            if(clientIp == null) {
                let url = encodeURIComponent(req.originalUrl);
                if (url === '%2Fuser%2Flogout') {
                    url = "/";
                }
                return res.redirect(`${options.loginUrl}?redirectTo=${url}`);
            }

            clientIp = clientIp.substr(clientIp.lastIndexOf(":") + 1);
            
            const userhistory = await UserHistory.findOne({
                where: {
                    clientIp: clientIp
                }
            });
            if (!!userhistory) {
                res.locals.user_id = req.session.manger_id;
                return next();
            }
        }
        let url = encodeURIComponent(req.originalUrl);
        if (url === '%2Fuser%2Flogout') {
            url = "/";
        }
        res.redirect(`${options.loginUrl}?redirectTo=${url}`);
    }
};