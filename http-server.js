const http = require('http');

module.exports = (app) => {
    const { logger } = app;
    logger.info(`HTTP Server: Starting server`);

    if (global.clustering_mode) {
        app.server = http.Server(app);
    } else {
        const port = process.env.PORT || 5055;

        app.server = http.createServer(app)
            .on('listening', () => {
                logger.info(`HTTP Server: Listening at port ${port}`);
                console.log(`****************************HTTP Server: Listening at port ${port}******************************`);
            })
            .on('close', () => {
                logger.info(`HTTP Server: Closing server`);
            })
            .on('error', (err) => {
                logger.error(err);
            })
            .listen(port);
    }

};