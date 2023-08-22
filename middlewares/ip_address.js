const requestIp = require('request-ip');

module.exports = () => {
    return (req, res, next) => {
        var publicAddress = requestIp.getClientIp(req);
        publicAddress = publicAddress.substr(publicAddress.lastIndexOf(":") + 1);
        req.publicAddress = publicAddress;
        next();
    }
}