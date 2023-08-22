const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf } = format;
const moment = require("moment");
const path = require('path');

module.exports = (app) => {
    const dir = path.resolve(process.cwd(), process.env.LOG_DIR || 'log');
    app.set('logger.dir', dir);

    app.logger = createLogger({
        format: combine(
            timestamp(),
            printf(({ level, message, timestamp }) => `${moment().format("YYYY-MM-DD HH:mm:ss")} ${level}: ${message}`)
        ),
        transports: [
            new transports.File({
                options: { flags: 'a' },
                filename: path.join(dir, `server.log`),
                maxsize: 1 << 20
            }),
        ],
    });

    if (process.env.NODE_ENV !== 'production') {
        app.logger.add(new transports.Console());
    }
};