module.exports = ({ username }) => {
    return async (req, res, next) => {
        req.session.manger = username;
        next();
    }
};