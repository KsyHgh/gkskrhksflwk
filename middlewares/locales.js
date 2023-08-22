module.exports = () => {
    return async (req, res, next) => {
        try {
            let locale = "ko";
            if (!!req.session.locale) {
                locale = req.session.locale;
            }

            res.locals.locale = locale;
            res.cookie('locale', locale);
        } catch (error) {
            console.log("error", "I18n", error.message, req);
        }
        next();
    }
}