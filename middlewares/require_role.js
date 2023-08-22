const errcode = require('err-code');

module.exports = (role) => {
    return (req, res, next) => {
        const user = req.currentUser;
        if (role && user && user.roles && user.roles.includes(role)) {
            next();
        } else {
            next(errcode(new Error('unathorized access'), { status: 401 }));
        }
    }
};